import {
  AuthenticationService,
  // ClerkService,
  DatabaseClientService,
  CmsService,
  EmailService,
  // FileUploadService,
  // FunctionsService,
  // StorageService,
  // StripeService,
} from "@/core";

export interface ServiceHost {
  getAuthenticationService(): AuthenticationService;

  // getDatabaseAdminService (): DatabaseService;
  getEmailService(): EmailService;
  getDatabaseClientService(): DatabaseClientService;

  getCmsService(): CmsService; // CmsService;
  // getFileUploadService(): FileUploadService;
  // getStorageService(): StorageService;
  // getStripeService(): StripeService;
  // getFunctionsService(): FunctionsService;
  // getClerkService(): ClerkService;
}
