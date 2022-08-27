import express from "express";
import usersService from "../../users/services/users.service";
import * as argon2 from "argon2";

import { HTTP400Error } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

class AuthMiddleware {
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      req.body.email
    );
    if (user) {
      const passwordHash = user.password;
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          email: user.email,
          permissionFlags: user.permissionFlags,
        };
        return next();
      }
    }
    res
      .status(HttpStatusCode.BAD_REQUEST)
      .send({ errors: [ResponseMessages.INVALID_DATA] });
    throw new HTTP400Error(ResponseMessages.INVALID_DATA);
  }
}

export default new AuthMiddleware();
