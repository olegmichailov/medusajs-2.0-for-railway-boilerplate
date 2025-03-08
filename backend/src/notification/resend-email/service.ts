import { AbstractNotificationService } from "@medusajs/medusa";
import { Resend } from "resend";

class ResendService extends AbstractNotificationService {
  protected readonly resend: Resend;
  protected readonly from: string;

  constructor(_, options) {
    super(_, options);
    this.resend = new Resend(options.api_key);
    this.from = options.from;
  }

  async sendNotification(event, data) {
    const { to, subject, html } = data;

    await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}

export default ResendService;