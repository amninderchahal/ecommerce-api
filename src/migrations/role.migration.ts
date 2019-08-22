import { InjectModel } from "@nestjs/mongoose";
import { ROLE_MODEL_TOKEN } from "../models/model-tokens";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import * as async from 'async';
import { Role } from "../interfaces/role.interface";

const roles = ['customer'];

@Injectable()
export class RoleMigration {
    private isFirstError = true;

    constructor(
        @InjectModel(ROLE_MODEL_TOKEN) private readonly roleModel: Model<Role>
    ) {
        async.each(roles, async role => {
            try {
                const existing = await this.roleModel.findOne({ name: role });
                if (!existing) {
                    await new this.roleModel({ name: role }).save();
                }
            }
            catch (e) {
                if (this.isFirstError) {
                    console.log('Roles Migration error', e);
                    this.isFirstError = false;
                }
            }
        });
    }

}