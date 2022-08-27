import express from "express";
import debug from "debug";

import filesService from "../services/files.service";

import { getObjectId } from "../../common/utils/db.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { HTTP404Error } from "../../common/utils/error.utils";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";
import { ObjectId } from "mongodb";

const log: debug.IDebugger = debug("app:files-middleware");

class FilesMiddleware {
  async validateFileExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const file = await filesService.readById(getObjectId(req.params.fileId));
    if (file) {
      res.locals.file = file;
      next();
    } else {
      res.status(HttpStatusCode.NOT_FOUND).send({
        errors: [ResponseMessages.FILE_NOT_FOUND(req.params.fileId)],
      });
      throw new HTTP404Error(
        ResponseMessages.FILE_NOT_FOUND(req.params.fileId)
      );
    }
  }

  async extractFileId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (!ObjectId.isValid(req.body.fileId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errors: [ResponseMessages.INVALID_ID],
      });
    }

    req.body._id = getObjectId(req.params.fileId.toString());
    next();
  }
}

export default new FilesMiddleware();
