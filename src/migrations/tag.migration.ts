import { InjectModel } from "@nestjs/mongoose";
import { TAG_MODEL_TOKEN } from "../models/model-tokens";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Tag } from "../interfaces/tag.interface";
import * as async from 'async';

const tags = [
    "Natural",
    "Organic",
    "Raw",
    "Gluten Free",
    "Non-GMO",
    "Kosher",
    "Vegan",
    "Paleo",
    "Low Fat",
    "Essential Oils",
    "No Added Sugar",
    "Peanut Free",
    "BPA Free",
    "Biodegradable"
];


@Injectable()
export class TagMigration {
    private isFirstError = true;

    constructor(
        @InjectModel(TAG_MODEL_TOKEN) private readonly tagModel: Model<Tag>
    ) {
        async.each(tags, async tag => {
            try {
                const existingTag = await this.tagModel.findOne({ name: tag });
                if (!existingTag) {
                    await new this.tagModel({ name: tag }).save();
                }
            }
            catch (e) {
                if (this.isFirstError) {
                    console.log('Tag Migration error', e);
                    this.isFirstError = false;
                }
            }
        });
    }

}