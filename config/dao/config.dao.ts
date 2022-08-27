import debug from "debug";
import { Types } from 'mongoose';

import { CreateConfigDto } from "../dto/create.config.dto";
import { PatchConfigDto } from "../dto/patch.config.dto";

import mongooseService from "../../common/services/mongoose.service";

const log: debug.IDebugger = debug("app:config-dao");

class ConfigDao {
  Schema = mongooseService.getMongoose().Schema;

  configSchema = new this.Schema(
    {
      maintenance: Boolean,
      minimumAppVersion: String,
      features: [String], // TODO: update this one with reference to Feature object
      languages: [String],
      privacyPolicy: String,
      termsAndConditions: String,
    },
    {
      collection: "config",
    }
  );

  Config = mongooseService.getMongoose().model("Config", this.configSchema);

  constructor() {
    log("Created new instance of ConfigDao");
  }

  async addConfig(configFields: CreateConfigDto) {
    const config = new this.Config({
      ...configFields,
    });

    await config.save();
    return config;
  }

  async getConfig() {
    return this.Config.find({}).exec();
  }

  async updateConfig(configFields: PatchConfigDto) {
    const config = await this.Config.find({});
    console.log(config);
/*     const existingUser = await this.Config.findOneAndUpdate(
      { _id: userId },
      { $set: configFields },
      { new: true }
    ).exec(); */

    return;
  }

  async removeConfig(configId: Types.ObjectId) {
    return this.Config.deleteOne({ _id: configId }).exec();
  }
}

export default new ConfigDao();
