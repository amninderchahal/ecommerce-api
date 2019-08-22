import { Injectable } from '@nestjs/common';
import { HashHelper } from '../../helpers/hash-helper';
import { AddUserRequest } from '../../request-dtos/user-requests';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../interfaces/user.interface';
import { USER_MODEL_TOKEN, TAG_MODEL_TOKEN, ROLE_MODEL_TOKEN, FILTER_MODEL_TOKEN } from '../../models/model-tokens';
import { Tag } from '../../interfaces/tag.interface';
import { Role } from '../../interfaces/role.interface';
import { Filter } from '../../interfaces/filter.interface';

@Injectable()
export class UserService {
    constructor(
        private hashHelper: HashHelper,
        @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<User>,
        @InjectModel(TAG_MODEL_TOKEN) private readonly tagModel: Model<Tag>,
        @InjectModel(ROLE_MODEL_TOKEN) private readonly roleModel: Model<Role>,
        @InjectModel(FILTER_MODEL_TOKEN) private readonly filterModel: Model<Filter>
    ) { }

    async register(user: AddUserRequest) {
        try {
            const role = await this.roleModel.findOne({ name: 'customer' });
            const newUser = new this.userModel({
                ...user,
                email: {
                    emailAddress: user.email
                },
                role: role._id
            });

            return await this.addUser(newUser);
        } catch (err) {
            console.log('register user', err);
            throw err instanceof Error ? 'Error occurred while confirming email address' : err;
        }
    }

    async confirmEmail(ct: string) {
        try {
            const user = await this.userModel.findOne({ "email._id": ct });
            if (user.email.isConfirmed) {
                throw "Email address already verified.";
            } else {
                user.email.isConfirmed = true;
                return await user.save();
            }
        } catch (err) {
            console.log('confirm email error', err);
            throw err instanceof Error ? 'Error occurred while confirming email address' : err;
        }
    }

    async getTags() {
        try {
            return await this.tagModel.find({}, { name: 1, _id: 1 });
        } catch (err) {
            console.log('Get tags error', err);
            throw 'Unexpected error occurred while getting  tags';
        }
    }

    async getFilters() {
        try {
            return await this.filterModel.find({}, { name: 1, _id: 1 });
        } catch (err) {
            console.log('Get filters error', err);
            throw 'Unexpected error occurred while getting filters';
        }
    }

    private async addUser(newUser: User) {
        try {
            const hash = await this.hashHelper.hashString(newUser.password);
            newUser.password = hash;
            return await newUser.save();
        }
        catch (err) {
            console.log('add user error', err);
            throw err.code == 11000 ? 'This email already exists in our database' : err;
        }
    }
}
