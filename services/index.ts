// import { ServiceHost, StorageService, StripeService } from "@/core";

import { CmsService, EmailService, ServiceHost } from "@/core";
import { authenticationService } from "./authentication/authentication-service";
import { cmsService } from "@/services/cms/cms-service";
import { databaseClientService } from "@/services/database/database-client-service";
import { emailService } from "./email-service";
// import { databaseClientService } from "./database/database-client-service";
// import { fileUploadService } from "./file-upload/file-upload-service";
// import { stripeService } from "./stripe-service/stripe-service";
// import { functionsService } from "./functions/functions-service";
// import { storageService } from "@/services/storage/storage-service";

// import { clerkService } from '@/services/clerk-service/clerk-service';
// import { databaseAdminService } from './database/database-admin-service';
// import { userPresenceService } from './user-presence/user-presence-service';
// import { liveMessageService } from './live-message/live-message-service';
// import { shopifyService } from './shopify/shopify-service';

/**
 * Service host
 *
 * @export
 * @interface ServiceHost
 */
export const serviceHost: ServiceHost = {
  getAuthenticationService() {
    return authenticationService;
  },
  getCmsService(): CmsService {
    return cmsService;
  },
  getEmailService(): EmailService {
    return emailService;
  },

  // getClerkService(): ClerkService {
  //   return clerkService;
  // },

  // getDatabaseAdminService() {
  //   return databaseService;
  // },

  getDatabaseClientService() {
    return databaseClientService;
  },

  // getFileUploadService() {
  //   return fileUploadService;
  // },
  //
  // getStripeService(): StripeService {
  //   return stripeService;
  // },
  // getStorageService(): StorageService {
  //   return storageService;
  // },
  // getFunctionsService() {
  //   return functionsService;
  // },
  //
  // getUserPresenceService() {
  //   return userPresenceService;
  // },
  //
  // /**
  //  * Get Shopify service
  //  *
  //  * @returns {ShopifyService}
  //  */
  // getShopifyService(): ShopifyService {
  //   return shopifyService;
  // },
  //
  // /**
  //  * Get live message service
  //  *
  //  * @returns {LiveMessageService}
  //  */
  //
  // getLiveMessageService(): LiveMessageService {
  //   return liveMessageService;
  // },
};
