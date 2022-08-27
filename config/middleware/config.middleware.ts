import express from "express";
import debug from "debug";

import configService from "../services/config.service";
import { HTTP400Error } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

const log: debug.IDebugger = debug("app:config-middleware");

class ConfigMiddleware {
  async validateThereIsNoExistingConfig(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const config = await configService.get();
    if (config) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ error: ResponseMessages.CONFIG_EXISTENT });
      throw new HTTP400Error(ResponseMessages.CONFIG_EXISTENT);
    } else {
      next();
    }
  }
}

export default new ConfigMiddleware();
