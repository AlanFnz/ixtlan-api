import { Types } from 'mongoose';

import FeatureFlagsDao from "../dao/featureFlags.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateFeatureFlagDto } from "../dto/create.featureFlag.dto";
import { PutFeatureFlagDto } from "../dto/put.featureFlag.dto";
import { PatchFeatureFlagDto } from "../dto/patch.featureFlag.dto";

class FeatureFlagsService implements CRUD {
  async create(resource: CreateFeatureFlagDto) {
    return FeatureFlagsDao.addFeature(resource);
  }

  async deleteById(id: Types.ObjectId) {
    return FeatureFlagsDao.removeFeatureById(id);
  }

  async list(limit: number, page: number) {
    return FeatureFlagsDao.getFeatures(limit, page);
  }

  async patchById(id: Types.ObjectId, resource: PatchFeatureFlagDto) {
    return FeatureFlagsDao.updateFeatureById(id, resource);
  }

  async readById(id: Types.ObjectId) {
    return FeatureFlagsDao.getFeatureById(id);
  }

  async putById(id: Types.ObjectId, resource: PutFeatureFlagDto) {
    return FeatureFlagsDao.updateFeatureById(id, resource);
  }
}

export default new FeatureFlagsService();
