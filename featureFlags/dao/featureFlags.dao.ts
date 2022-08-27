import debug from "debug";
import { Types } from "mongoose";

import { CreateFeatureFlagDto } from "../dto/create.featureFlag.dto";
import { PatchFeatureFlagDto } from "../dto/patch.featureFlag.dto";
import { PutFeatureFlagDto } from "../dto/put.featureFlag.dto";

import mongooseService from "../../common/services/mongoose.service";

const log: debug.IDebugger = debug("app:feature-flags-dao");

class FeatureFlagsDao {
  Schema = mongooseService.getMongoose().Schema;

  featureFlagSchema = new this.Schema({
    name: { type: String, required: true },
    version: { type: String, required: true },
    minimumAppVersion: { type: String, required: true },
    enabledIOS: { type: Boolean, required: true },
    enabledAndroid: { type: Boolean, required: true },
    enabledWeb: { type: Boolean, required: true },
    permissionFlags: { type: Number }, // TODO: we may want to add a default value
  });

  Feature = mongooseService.getMongoose().model("Feature", this.featureFlagSchema);

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor() {
    log("Created new instance of FeatureFlagsDao");
  }

  // methods /////////////////

  async addFeature(featureFields: CreateFeatureFlagDto) {
    return await new this.Feature(featureFields);
  }

  async getFeatureById(featureId: Types.ObjectId) {
    return this.Feature.findById(featureId).exec();
  }

  async getFeatures(limit = 25, page = 0) {
    return this.Feature.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async updateFeatureById(
    featureId: Types.ObjectId,
    featureFields: PatchFeatureFlagDto | PutFeatureFlagDto
  ) {
    const existingFeature = await this.Feature.findOneAndUpdate(
      { _id: featureId },
      { $set: featureFields },
      { new: true }
    ).exec();

    return existingFeature;
  }

  async removeFeatureById(featureId: Types.ObjectId) {
    return this.Feature.deleteOne({ _id: featureId }).exec();
  }
}

export default new FeatureFlagsDao();
