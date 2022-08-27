import express from "express";
import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { APIError } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

const log: debug.IDebugger = debug("app:auth-controller");

const tokenExpirationInSeconds = 36000; // TODO: move to config

class AuthController {
  async createJWT(req: express.Request, res: express.Response) {
    try {
      // @ts-expect-error
      const jwtSecret: string = process.env.JWT_SECRET;
      const refreshId = req.body.userId + jwtSecret;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn: tokenExpirationInSeconds,
      });
      return res
        .status(HttpStatusCode.CREATED)
        .send({ accessToken: token, refreshToken: hash });
    } catch (err) {
      log("createJWT error: ", err);
      res.status(HttpStatusCode.INTERNAL_SERVER).send();
      throw new APIError(ResponseMessages.JWT_FAIL);
    }
  }
}

export default new AuthController();
