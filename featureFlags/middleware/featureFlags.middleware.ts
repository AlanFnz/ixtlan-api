import express from "express";
import debug from "debug";

import featureFlagsService from "../services/featureFlags.service";

import { getObjectId } from "../../common/utils/db.utils";
import { APIError, HTTP404Error } from "../../common/utils/error.utils";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";

const log: debug.IDebugger = debug("app:feature-flags-middleware");

class FeatureFlagsMiddleware {
  async validateFeatureExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const feature = await featureFlagsService.readById(
      getObjectId(req.params.featureId)
    );
    if (feature) {
      next();
    } else {
      res.status(HttpStatusCode.NOT_FOUND).send({
        error: ResponseMessages.FEATURE_NOT_FOUND(req.params.featureId),
      });
      throw new HTTP404Error(
        ResponseMessages.FEATURE_NOT_FOUND(req.params.featureId)
      );
    }
  }

  async extractFeatureId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      req.body._id = getObjectId(req.params.featureId.toString());
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.OBJECT_ID_ERROR],
      });
      throw new APIError(ResponseMessages.OBJECT_ID_ERROR);
    }
    next();
  }
}

export default new FeatureFlagsMiddleware();
