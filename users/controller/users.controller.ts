import express from "express";
import usersService from "../services/users.service";
import argon2 from "argon2";
import debug from "debug";

import { PatchUserDto } from "../dto/patch.user.dto";
import { APIError } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    let users: any[];
    try {
      users = await usersService.list(100, 0);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USERS_GET_FAIL],
      });
      throw new APIError(ResponseMessages.USERS_GET_FAIL);
    }
    res.status(HttpStatusCode.SUCCESS).send(users);
  }

  async getUserById(req: express.Request, res: express.Response) {
    let user: any;
    try {
      user = await usersService.readById(req.body._id);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_GET_FAIL],
      });
      throw new APIError(ResponseMessages.USER_GET_FAIL);
    }

    if (user) {
      res.status(HttpStatusCode.SUCCESS).send(user);
    } else {
      res.status(HttpStatusCode.NOT_FOUND).send({
        errors: [ResponseMessages.USER_NOT_FOUND(req.body._id)],
      });
    }
  }

  async createUser(req: express.Request, res: express.Response) {
    try {
      const user = await usersService.create(req.body);
      res.status(HttpStatusCode.CREATED).send(user);
    } catch (e) {
      log(e);
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_CREATE_FAIL],
      });
      throw new APIError(ResponseMessages.USER_CREATE_FAIL);
    }
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      try {
        req.body.password = await argon2.hash(req.body.password);
      } catch (e) {
        log(e);
        res.status(HttpStatusCode.INTERNAL_SERVER).send({
          errors: [ResponseMessages.USER_PASSWORD_HASHING_ERROR],
        });
        throw new APIError(ResponseMessages.USER_CREATE_FAIL);
      }
    }

    try {
      log(await usersService.patchById(req.body._id, req.body));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_PASSWORD_HASHING_ERROR],
      });
      throw new APIError(ResponseMessages.USER_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async put(req: express.Request, res: express.Response) {
    try {
      log(await usersService.putById(req.body._id, req.body));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_PASSWORD_HASHING_ERROR],
      });
      throw new APIError(ResponseMessages.USER_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async removeUser(req: express.Request, res: express.Response) {
    try {
      log(await usersService.deleteById(req.body._id));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_PASSWORD_HASHING_ERROR],
      });
      throw new APIError(ResponseMessages.USER_DELETE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async updatePermissionFlags(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDto = {
      permissionFlags: parseInt(req.params.permissionFlags),
    };

    try {
      log(await usersService.patchById(req.body._id, patchUserDto));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.USER_PASSWORD_HASHING_ERROR],
      });
      throw new APIError(ResponseMessages.USER_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }
}

export default new UsersController();
