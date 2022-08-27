export const ResponseMessages = {
  // common
  VALIDATION_ERROR:
    "One or more errors occurred when validating this request body",
  OBJECT_ID_ERROR: "Something went wrong when getting this object id",
  INVALID_ID: "Invalid ID",
  // auth
  JWT_FAIL: "Something went wrong when creating this token",
  JWT_REFRESH_INVALID: "Invalid refresh token",
  JWT_REFRESH_MISSING: "Missing required field: refreshToken",
  INVALID_DATA: "Invalid email and/or password",
  // permissions
  FORBIDDEN: "This user doesn't have the required permissions",
  PERMISSION_PARSING_ERROR:
    "Something went wrong when parsing this user's permissions",
  USER_CANNOT_CHANGE_PERMISSIONS: "User cannot change permission flags",
  // config
  CONFIG_EXISTENT: "A config object already exists",
  CONFIG_GET_FAIL: "Something went wrong when fetching the config",
  CONFIG_CREATE_FAIL: "Something went wrong when creating this config",
  CONFIG_UPDATE_FAIL: "Something went wrong when updating this config",
  CONFIG_DELETE_FAIL: "Something went wrong when deleting this config",
  // features
  FEATURE_NOT_FOUND: (featureId: any) => `Feature ${featureId} not found`,
  FEATURES_GET_FAIL: "Something went wrong when fetching features",
  FEATURE_GET_FAIL: "Something went wrong when fetching this feature",
  FEATURE_CREATE_FAIL: "Something went wrong when creating this feature",
  FEATURE_UPDATE_FAIL: "Something went wrong when updating this feature",
  FEATURE_DELETE_FAIL: "Something went wrong when deleting this feature",
  // users
  USERS_GET_FAIL: "Something went wrong when fetching users",
  USER_CREATE_FAIL: "Something went wrong when creating this user",
  USER_GET_FAIL: "Something went wrong when fetching this user",
  USER_UPDATE_FAIL: "Something went wrong when updating this user",
  USER_DELETE_FAIL: "Something went wrong when deleting this user",
  USER_PASSWORD_HASHING_ERROR: "Something went wrong when hashing this password",
  USER_PASSWORD_NOT_FOUND: "Password field not found",
  USER_EMAIL_EXISTS: "User email already exists",
  USER_EMAIL_INVALID: "Invalid email",
  USER_NOT_FOUND: (userId: any) => `User ${userId} not found`,
  USER_LAST_LOGIN_UPDATE_ERROR:
    "Something went wrong when updating this user's last login date",
  // files
  FILE_NOT_FOUND: (fileId: any) => `File ${fileId} not found`,
  FILES_GET_FAIL: "Something went wrong when fetching files",
  FILE_CREATE_FAIL: "Something went wrong when creating this file",
  FILE_GET_FAIL: "Something went wrong when fetching this file",
  FILE_UPDATE_FAIL: "Something went wrong when updating this file",
  FILE_DELETE_FAIL: "Something went wrong when deleting this file",
};
