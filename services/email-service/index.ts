import { EmailService } from '@/core';
import { sendEmailWithApiRoute } from '@/services/email-service/send-email';

export const emailService: EmailService = {
  sendEmail: async (payload) => {
    await sendEmailWithApiRoute(payload.firstName)
  }
}
