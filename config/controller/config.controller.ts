import express from "express";
import configService from "../services/config.service";
import debug from "debug";

import { getObjectId } from "../../common/utils/db.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";
import { APIError } from "../../common/utils/error.utils";

const log: debug.IDebugger = debug("app:config-controller");

class ConfigController {
  async getConfig(req: express.Request, res: express.Response) {
    let config: any[];
    try {
      config = await configService.get();
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.CONFIG_GET_FAIL],
      });
      throw new APIError(ResponseMessages.CONFIG_GET_FAIL);
    }
    res.status(HttpStatusCode.SUCCESS).send(config);
  }

  async createConfig(req: express.Request, res: express.Response) {
    let configId: any;
    try {
      configId = await configService.create(req.body);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.CONFIG_CREATE_FAIL],
      });
      throw new APIError(ResponseMessages.CONFIG_CREATE_FAIL);
    }
    res.status(HttpStatusCode.CREATED).send(configId);
  }

  async updateConfig(req: express.Request, res: express.Response) {
    try {
      log(await configService.update(req.body));
    } catch (e) {
      log(e);
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.CONFIG_UPDATE_FAIL],
      });
      throw new APIError(ResponseMessages.CONFIG_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async deleteConfig(req: express.Request, res: express.Response) {
    try {
      await configService.delete(getObjectId(req.body._id));
    } catch (e) {
      log(e);
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.CONFIG_DELETE_FAIL],
      });
      throw new APIError(ResponseMessages.CONFIG_DELETE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }
}

export default new ConfigController();
