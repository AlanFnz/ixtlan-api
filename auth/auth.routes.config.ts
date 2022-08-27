import express from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import authController from "./controller/auth.controller";

import jwtMiddleware from "./middleware/jwt.middleware";
import authMiddleware from "./middleware/auth.middleware";
import BodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import usersMiddleware from "../users/middleware/users.middleware";
// @ts-ignore
import { AUTH } from "../common/constants/endpoints";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(AUTH.AUTH, [
      body("email").isEmail(),
      body("password").isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddleware.verifyUserPassword,
      usersMiddleware.updateUserLastLogin,
      authController.createJWT,
    ]);

    this.app.post(AUTH.AUTH_REFRESH_TOKEN, [
      jwtMiddleware.validJWTNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT,
    ]);

    return this.app;
  }
}
