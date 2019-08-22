import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Filter } from "../interfaces/filter.interface";
import { FILTER_MODEL_TOKEN } from "../models/model-tokens";
import * as async from 'async';

const filters = ['Price', 'Ethics', 'Local', 'Diet Weight', 'Value', 'Fair trade', 'Nutrition', 'Grocery'];

@Injectable()
export class FilterMigration {
    private isFirstError = true;

    constructor(
        @InjectModel(FILTER_MODEL_TOKEN) private readonly filterModel: Model<Filter>
    ) {
        async.each(filters, async filter => {
            try {
                const existing = await this.filterModel.findOne({name: filter});
                if (!existing) {
                    await new this.filterModel({ name: filter }).save();
                }
            }
            catch (e) {
                if (this.isFirstError) {
                    console.log('Filters Migration error', e);
                    this.isFirstError = false;
                }
            }
        });
    }

}