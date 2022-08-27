import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Jwt } from "../../common/types/jwt";
import usersService from "../../users/services/users.service";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

class JwtMiddleware {
  verifyRefreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res
        .status(400)
        .send({ errors: [ResponseMessages.JWT_REFRESH_MISSING] });
    }
  }

  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // @ts-expect-error
    const jwtSecret: string = process.env.JWT_SECRET;
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest("base64");
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    } else {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ errors: [ResponseMessages.JWT_REFRESH_INVALID] });
    }
  }

  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        // @ts-expect-error
        const jwtSecret: string = process.env.JWT_SECRET;
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(HttpStatusCode.CREATED).send();
        } else {
          res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
          next();
        }
      } catch (err) {
        return res
          .status(HttpStatusCode.FORBIDDEN)
          .send({ error: err.message });
      }
    } else {
      return res.status(HttpStatusCode.CREATED).send();
    }
  }
}

export default new JwtMiddleware();
