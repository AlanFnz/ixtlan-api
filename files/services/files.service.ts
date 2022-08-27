import { Types } from 'mongoose';

import FilesDao from "../dao/files.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateFileDto } from "../dto/create.file.dto";
import { PutFileDto } from "../dto/put.file.dto";
import { PatchFileDto } from "../dto/patch.file.dto";

class FilesService implements CRUD {
  async create(resource: CreateFileDto) {
    return FilesDao.addFile(resource);
  }

  async deleteById(id: Types.ObjectId) {
    return FilesDao.removeFileById(id);
  }

  async list(limit: number, page: number) {
    return FilesDao.getFiles(limit, page);
  }

  async patchById(id: Types.ObjectId, resource: PatchFileDto) {
    return FilesDao.updateFileById(id, resource);
  }

  async readById(id: Types.ObjectId) {
    return FilesDao.getFileById(id);
  }

  async putById(id: Types.ObjectId, resource: PutFileDto) {
    return FilesDao.updateFileById(id, resource);
  }
}

export default new FilesService();
