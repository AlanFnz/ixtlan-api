import express from "express";
import debug from "debug";
import argon2 from "argon2";

import userService from "../services/users.service";

import { getObjectId } from "../../common/utils/db.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import {
  APIError,
  HTTP400Error,
  HTTP404Error,
} from "../../common/utils/error.utils";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";
import { ObjectId } from "mongodb";

const log: debug.IDebugger = debug("app:users-middleware");

class UsersMiddleware {
  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByEmail(req.body.email);
    if (user) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ errors: [ResponseMessages.USER_EMAIL_EXISTS] });
      throw new HTTP400Error(ResponseMessages.USER_EMAIL_EXISTS);
    } else {
      next();
    }
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.user._id.toString() === req.params.userId.toString()) {
      next();
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ errors: [ResponseMessages.USER_EMAIL_EXISTS] });
      throw new HTTP400Error(ResponseMessages.USER_EMAIL_EXISTS);
    }
  }

  validatePatchEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.body.email) {
      log("Validating email", req.body.email);

      this.validateSameEmailBelongToSameUser(req, res, next);
    } else {
      next();
    }
  };

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.readById(getObjectId(req.params.userId));
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.status(HttpStatusCode.NOT_FOUND).send({
        errors: [ResponseMessages.USER_NOT_FOUND(req.params.userId)],
      });
      throw new HTTP404Error(
        ResponseMessages.USER_NOT_FOUND(req.params.userId)
      );
    }
  }

  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!ObjectId.isValid(req.params.userId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errors: [ResponseMessages.INVALID_ID],
      });
    }

    req.body._id = getObjectId(req.params.userId.toString());
    next();
  }

  async userCantChangePermission(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      "permissionFlags" in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      res.status(HttpStatusCode.BAD_REQUEST).send({
        errors: [ResponseMessages.USER_CANNOT_CHANGE_PERMISSIONS],
      });
      throw new HTTP400Error(ResponseMessages.USER_CANNOT_CHANGE_PERMISSIONS);
    } else {
      next();
    }
  }

  async updateUserLastLogin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!ObjectId.isValid(req.params.userId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errors: [ResponseMessages.INVALID_ID],
      });
    }

    const user = await userService.readById(getObjectId(req.body.userId));

    if (user) {
      try {
        user.lastLogin = new Date().getDate();
        user.save();
        next();
      } catch (e) {
        res.status(HttpStatusCode.INTERNAL_SERVER).send({
          errors: [ResponseMessages.USER_LAST_LOGIN_UPDATE_ERROR],
        });
        throw new APIError(ResponseMessages.USER_LAST_LOGIN_UPDATE_ERROR);
      }
    }
  }

  async hashUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
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
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errors: [ResponseMessages.USER_PASSWORD_NOT_FOUND],
      });
    }
    next();
  }
}

export default new UsersMiddleware();
