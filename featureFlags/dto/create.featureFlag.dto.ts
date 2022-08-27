export interface CreateFeatureFlagDto {
  name: string;
  version: string;
  minimumAppVersion: string;
  enabledIOS: boolean;
  enabledAndroid: boolean
  enabledWeb: boolean
  permissionFlags?: number
}
