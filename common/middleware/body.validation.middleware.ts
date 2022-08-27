import express from "express";
import { validationResult } from "express-validator";
import { HttpStatusCode } from "../constants/httpStatusCode.constants";
import { ResponseMessages } from "../constants/responseMessages.constants";
import { HTTP400Error } from "../utils/error.utils";

class BodyValidationMiddleware {
  verifyBodyFieldsErrors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HttpStatusCode.BAD_REQUEST).send({ errors: errors.array() });
      throw new HTTP400Error(ResponseMessages.VALIDATION_ERROR);
    }
    next();
  }
}

export default new BodyValidationMiddleware();
