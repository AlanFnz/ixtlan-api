import { Types } from 'mongoose'

import ConfigDao from "../dao/config.dao";
import { CreateConfigDto } from "../dto/create.config.dto";
import { PatchConfigDto } from "../dto/patch.config.dto";

class ConfigService {
  async create(resource: CreateConfigDto) {
    return ConfigDao.addConfig(resource);
  }

  async get() {
    return ConfigDao.getConfig();
  }

  async update(resource: PatchConfigDto) {
    return ConfigDao.updateConfig(resource);
  }

  async delete(id: Types.ObjectId) {
    return ConfigDao.removeConfig(id);
  }
}

export default new ConfigService();
