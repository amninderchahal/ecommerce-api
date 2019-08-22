import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { Constants } from 'src/constants';

@Injectable()
export class TokenHelper {
    private defaultOptions: any;
    private privateKEY = fs.readFileSync(path.resolve(__dirname, "../../assets/keys/private.key"), 'utf8');
    private publicKEY = fs.readFileSync(path.resolve(__dirname, "../../assets/keys/public.key"), 'utf8');

    constructor() {
        this.defaultOptions = {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
            expiresIn: `${Constants.jwtOptions.expiresInHours}h`,
            algorithm: "RS256"
        }
    }

    createToken(payload): Promise<any> {
        return new Promise((resolve, reject) => {
            sign(payload, this.privateKEY, this.defaultOptions, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    verify(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const verifyOptions = { 
                ...this.defaultOptions,
                algorithms: [this.defaultOptions.algorithm]
            };

            verify(token, this.publicKEY, verifyOptions, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

}
