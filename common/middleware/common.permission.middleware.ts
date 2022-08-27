import express from "express";
import debug from "debug";

import { PermissionFlag } from "./common.permissionflag.enum";
import { APIError, HTTP403Error } from "../utils/error.utils";
import { HttpStatusCode } from "../constants/httpStatusCode.constants";
import { ResponseMessages } from "../constants/responseMessages.constants";

class CommonPermissionMiddleware {
  log: debug.IDebugger = debug("app:common-permission-middleware");

  permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (userPermissionFlags & requiredPermissionFlag) {
          next();
        } else {
          res.status(HttpStatusCode.FORBIDDEN).send();
          throw new HTTP403Error(ResponseMessages.FORBIDDEN);
        }
      } catch (e) {
        this.log(e);
        throw new APIError(ResponseMessages.PERMISSION_PARSING_ERROR);
      }
    };
  }

  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        res.status(HttpStatusCode.FORBIDDEN).send();
        throw new HTTP403Error(ResponseMessages.FORBIDDEN);
      }
    }
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
      res.status(HttpStatusCode.FORBIDDEN).send({
        errors: [ResponseMessages.USER_CANNOT_CHANGE_PERMISSIONS],
      });
      throw new HTTP403Error(ResponseMessages.USER_CANNOT_CHANGE_PERMISSIONS);
    } else {
      next();
    }
  }
}

export default new CommonPermissionMiddleware();
