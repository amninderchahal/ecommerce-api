import { Injectable } from '@nestjs/common';
import { HashHelper } from '../../helpers/hash-helper';
import { TokenHelper } from '../../helpers/token-helper';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL_TOKEN } from '../../models/model-tokens';
import { Model } from 'mongoose';
import { User } from '../../interfaces/user.interface';
import { ResetPasswordRequest } from '../../request-dtos/auth-requests';

@Injectable()
export class AuthService {
    constructor(
        private hashHelper: HashHelper,
        private tokenHelper: TokenHelper,
        @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<User>,
    ) { }

    async login(email: string, password: string) {
        try {
            const user = await this.userModel.findOne({
                "email.emailAddress": email
            })
                .select("+password")
                .populate('role', 'name');

            if (!user) {
                throw "Email address not found.";
            }
            let isMatch = await this.hashHelper.compareHash(password, user.password);

            if (isMatch) {
                return await this.createJwtForUser(user);
            } else {
                throw "Wrong Password";
            }
        } catch (err) {
            console.log('Login error', err);
            throw (err instanceof Error) ? "Unexpected error occurred" : err;
        }
    }

    async validateToken(token: string) {
        try {
            return await this.tokenHelper.verify(token);
        } catch (err) {
            console.log('Token validation error', err);
            throw err.message ? err.message : 'Token validation failed.';
        }
    }

    async resetPassword(resetPwdReq: ResetPasswordRequest) {
        try {
            const existingUser = await this.userModel.findOne({ "email._id": resetPwdReq.resetToken });
            if (!existingUser) {
                throw "User does not exist.";
            } else {
                const hash = await this.hashHelper.hashString(resetPwdReq.newPassword);
                existingUser.password = hash;
                return await existingUser.save();
            }
        } catch (err) {
            console.log('Reset password error', err);
            throw (err instanceof Error) ? "Unexpected error occurred" : err;
        }
    }

    async forgotPassword(email: string) {
        try {
            const user = await this.userModel.findOne({ "email.emailAddress": email });
            if (!user) {
                throw "User does not exist";
            } else {
                return user;
            }
        } catch (err) {
            console.log('Forgot password error', err);
            throw (err instanceof Error) ? "Unexpected error occurred" : err;
        }
    }

    private async createJwtForUser(user: User) {
        const payload = {
            id: user._id,
            email: user.email.emailAddress,
            role: user.role.name
        }

        return await Promise.all([user, this.tokenHelper.createToken(payload)]);
    }
}
