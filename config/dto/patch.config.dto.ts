export interface PatchConfigDto {
  maintenance: boolean;
  minimumAppVersion?: string;
  features?: string;
  languages?: string;
  privacyPolicy?: string;
  termsAndConditions?: string;
}
