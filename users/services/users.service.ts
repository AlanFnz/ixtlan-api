import { Types } from 'mongoose';

import UsersDao from "../dao/users.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  async deleteById(id: Types.ObjectId) {
    return UsersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers(limit, page);
  }

  async patchById(id: Types.ObjectId, resource: PatchUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async readById(id: Types.ObjectId) {
    return UsersDao.getUserById(id);
  }

  async putById(id: Types.ObjectId, resource: PutUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return UsersDao.getUserByEmailWithPassword(email);
  }
}

export default new UsersService();
