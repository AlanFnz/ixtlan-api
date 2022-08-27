import express from "express";
import filesService from "../services/files.service";
import argon2 from "argon2";
import debug from "debug";

import { APIError } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

const log: debug.IDebugger = debug("app:users-controller");

class FilesController {
  async listFiles(req: express.Request, res: express.Response) {
    let files: any[];
    try {
      files = await filesService.list(100, 0);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILES_GET_FAIL],
      });
      throw new APIError(ResponseMessages.FILES_GET_FAIL);
    }
    res.status(HttpStatusCode.SUCCESS).send(files);
  }

  async getFileById(req: express.Request, res: express.Response) {
    let file: any;
    try {
      file = await filesService.readById(req.body._id);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILE_GET_FAIL],
      });
      throw new APIError(ResponseMessages.FILE_GET_FAIL);
    }

    if (file) {
      res.status(HttpStatusCode.SUCCESS).send(file);
    } else {
      res.status(HttpStatusCode.NOT_FOUND).send({
        errors: [ResponseMessages.FILE_NOT_FOUND(req.body._id)],
      });
    }
  }

  async createFile(req: express.Request, res: express.Response) {
    try {
      const file = await filesService.create(req.body);
      res.status(HttpStatusCode.CREATED).send(file);
    } catch (e) {
      log(e);
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILE_CREATE_FAIL],
      });
      throw new APIError(ResponseMessages.FILE_CREATE_FAIL);
    }
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      try {
        req.body.password = await argon2.hash(req.body.password);
      } catch (e) {
        log(e);
        res.status(HttpStatusCode.INTERNAL_SERVER).send({
          errors: [ResponseMessages.FILE_UPDATE_FAIL],
        });
        throw new APIError(ResponseMessages.FILE_UPDATE_FAIL);
      }
    }

    try {
      log(await filesService.patchById(req.body._id, req.body));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILE_UPDATE_FAIL],
      });
      throw new APIError(ResponseMessages.FILE_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async put(req: express.Request, res: express.Response) {
    try {
      log(await filesService.putById(req.body._id, req.body));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILE_UPDATE_FAIL],
      });
      throw new APIError(ResponseMessages.FILE_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async removeFile(req: express.Request, res: express.Response) {
    try {
      log(await filesService.deleteById(req.body._id));
    } catch (e) {
      log(e)
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.FILE_DELETE_FAIL],
      });
      throw new APIError(ResponseMessages.FILE_DELETE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }
}

export default new FilesController();
