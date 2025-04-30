export interface SendEmailPayload {
  firstName: string;
}

export interface EmailService {
  sendEmail: (payload: SendEmailPayload) => Promise<void>;
}
