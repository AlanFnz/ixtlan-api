//////// CONFIG ////////
const CONFIG_BASE = "/config";
const PARAM_CONFIG_ID = "/:configId";
/////// FEATURES ///////
const FEATURES_BASE = "/features";
const PARAM_FEATURE_ID = "/:featureId";
//////// AUTH /////////
const AUTH_BASE = "/auth";
const AUTH_REFRESH_TOKEN = "/refresh-token";
//////// USERS /////////
const USERS_BASE = "/users";
const PARAM_USER_ID = "/:userId";
//////// FILES /////////
const FILES_BASE = "/files";
const PARAM_FILE_ID = "/:fileId";
/// PERMISSION FLAGS ///
const PERMISSION_FLAGS = "/permissionFlags";
const PARAM_PERMISSION_FLAGS = "/:permissionFlags";

////////////////////////
////////////////////////
////////////////////////

export const CONFIG = {
  CONFIG: CONFIG_BASE,
  CONFIG_ID: CONFIG_BASE + PARAM_CONFIG_ID,
};

export const FEATURES = {
  FEATURES: FEATURES_BASE,
  FEATURE_ID: FEATURES_BASE + PARAM_FEATURE_ID,
  FEATURE_PERMISSION_FLAGS:
    FEATURES_BASE +
    PARAM_FEATURE_ID +
    PERMISSION_FLAGS +
    PARAM_PERMISSION_FLAGS,
};

export const AUTH = {
  AUTH: AUTH_BASE,
  AUTH_REFRESH_TOKEN: AUTH_BASE + AUTH_REFRESH_TOKEN,
};

export const USERS = {
  USERS: USERS_BASE,
  USER_ID: USERS_BASE + PARAM_USER_ID,
  USER_PERMISSION_FLAGS:
    USERS_BASE + PARAM_USER_ID + PERMISSION_FLAGS + PARAM_PERMISSION_FLAGS,
};

export const FILES = {
  USERS: FILES_BASE,
  USER_ID: FILES_BASE + PARAM_FILE_ID,
  USER_PERMISSION_FLAGS:
    FILES_BASE + PARAM_FILE_ID + PERMISSION_FLAGS + PARAM_PERMISSION_FLAGS,
};
