import express from "express";
import featureFlagsService from "../services/featureFlags.service";
import argon2 from "argon2";
import debug from "debug";

import { PatchFeatureFlagDto } from "../dto/patch.featureFlag.dto";
import { HttpStatusCode } from "../../common/constants/httpStatusCode.constants";
import { ResponseMessages } from "../../common/constants/responseMessages.constants";
import { APIError } from "../../common/utils/error.utils";

const log: debug.IDebugger = debug("app:feature-flags-controller");

class FeatureFlagsController {
  async listFeatures(req: express.Request, res: express.Response) {
    let features: any[];
    try {
      features = await featureFlagsService.list(100, 0);
    } catch (e) {
      res.status(HttpStatusCode.INTERNAL_SERVER).send({
        errors: [ResponseMessages.CONFIG_GET_FAIL],
      });
      throw new APIError(ResponseMessages.FEATURES_GET_FAIL);
    }
    res.status(HttpStatusCode.SUCCESS).send(features);
  }

  async getFeatureById(req: express.Request, res: express.Response) {
    let feature: any [];
    try {
      feature = await featureFlagsService.readById(req.body._id);
    } catch (e) {
      throw new APIError(ResponseMessages.FEATURE_GET_FAIL);
    }
    res.status(HttpStatusCode.SUCCESS).send(feature);
  }

  async createFeature(req: express.Request, res: express.Response) {
    let feature: any [];
    try {
      feature = await featureFlagsService.create(req.body);
    } catch (e) {
      throw new APIError(ResponseMessages.FEATURE_CREATE_FAIL);
    }
    res.status(HttpStatusCode.CREATED).send(feature);
  }

  async patch(req: express.Request, res: express.Response) {
    try {
      log(await featureFlagsService.patchById(req.body._id, req.body));
    } catch (e) {
      throw new APIError(ResponseMessages.FEATURE_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async put(req: express.Request, res: express.Response) {
    try {
      log(await featureFlagsService.putById(req.body._id, req.body));
    } catch (e) {
      throw new APIError(ResponseMessages.FEATURE_UPDATE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async removeFeature(req: express.Request, res: express.Response) {
    try {
      log(await featureFlagsService.deleteById(req.body._id));
    } catch (e) {
      throw new APIError(ResponseMessages.FEATURE_DELETE_FAIL);
    }
    res.status(HttpStatusCode.NO_CONTENT).send();
  }

  async updatePermissionFlags(req: express.Request, res: express.Response) {
    const patchFeatureFlagDto: PatchFeatureFlagDto = {
      permissionFlags: parseInt(req.params.permissionFlags),
    };
    log(await featureFlagsService.patchById(req.body._id, patchFeatureFlagDto));
    res.status(HttpStatusCode.NO_CONTENT).send();
  }
}

export default new FeatureFlagsController();
