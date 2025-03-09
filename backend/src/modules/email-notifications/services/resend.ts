import { Logger, NotificationTypes } from '@medusajs/framework/types';
import { AbstractNotificationProviderService, MedusaError } from '@medusajs/framework/utils';
import { Resend, CreateEmailOptions } from 'resend';
import { ReactNode } from 'react';
import { generateEmailTemplate } from '../templates';

type InjectedDependencies = {
  logger: Logger;
};

interface ResendServiceConfig {
  apiKey: string;
  from: string;
}

export interface ResendNotificationServiceOptions {
  api_key: string;
  from: string;
}

type NotificationEmailOptions = Omit<
  CreateEmailOptions,
  'to' | 'from' | 'react' | 'html' | 'attachments'
>;

/**
 * 📩 Сервис для отправки email-уведомлений через Resend API.
 */
export default class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = 'resend'; // ❗ Должно совпадать с medusa.config.ts

  protected config_: ResendServiceConfig;
  protected logger_: Logger;
  protected resend: Resend;

  constructor({ logger }: InjectedDependencies, options: ResendNotificationServiceOptions) {
    super();
    this.config_ = {
      apiKey: options.api_key,
      from: options.from,
    };
    this.logger_ = logger;
    this.resend = new Resend(this.config_.apiKey);
  }

  async send(
    notification: NotificationTypes.ProviderSendNotificationDTO
  ): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'No notification data provided.');
    }
    if (notification.channel !== 'email') {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, 'Only email notifications are supported.');
    }

    // 🔹 Генерация email-контента на основе шаблона
    let emailContent: ReactNode;
    try {
      emailContent = generateEmailTemplate(notification.template, notification.data);
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to generate email content for template: ${notification.template}`
      );
    }

    const emailOptions = notification.data.emailOptions as NotificationEmailOptions;

    // 🔹 Формируем email-сообщение
    const message: CreateEmailOptions = {
      to: notification.to,
      from: this.config_.from,
      subject: emailOptions.subject ?? 'Notification from Gmorkl Store',
      react: emailContent,
      headers: emailOptions.headers,
      replyTo: emailOptions.replyTo,
      cc: emailOptions.cc,
      bcc: emailOptions.bcc,
      tags: emailOptions.tags,
      text: emailOptions.text,
      attachments: Array.isArray(notification.attachments)
        ? notification.attachments.map((attachment) => ({
            content: attachment.content,
            filename: attachment.filename,
            content_type: attachment.content_type,
            disposition: attachment.disposition ?? 'attachment',
          }))
        : undefined,
      scheduledAt: emailOptions.scheduledAt,
    };

    // 🔹 Отправляем email через Resend
    try {
      const response = await this.resend.emails.send(message);
      this.logger_.log(`✅ Successfully sent "${notification.template}" email to ${notification.to}`);
      return { id: response.id, status: 'sent' };
    } catch (error) {
      this.logger_.error(
        `❌ Failed to send "${notification.template}" email to ${notification.to}: ${error.message}`
      );
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Resend API error: ${error.message}`
      );
    }
  }
}
