import { Logger, NotificationTypes } from '@medusajs/framework/types'
import { AbstractNotificationProviderService, MedusaError } from '@medusajs/framework/utils'
import { Resend, CreateEmailOptions } from 'resend'
import { ReactNode } from 'react'
import { generateEmailTemplate } from '../templates'

type InjectedDependencies = { logger: Logger }

interface ResendServiceConfig {
  apiKey: string
  from: string
}

export interface ResendNotificationServiceOptions {
  api_key: string
  from: string
}

type NotificationEmailOptions = Omit<
  CreateEmailOptions,
  'to' | 'from' | 'react' | 'html' | 'attachments'
>

export class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = 'resend' // 🔹 Этот id должен совпадать с `medusa.config.ts`
  protected config_: ResendServiceConfig
  protected logger_: Logger
  protected resend: Resend

  constructor({ logger }: InjectedDependencies, options: ResendNotificationServiceOptions) {
    super()
    this.config_ = {
      apiKey: options.api_key,
      from: options.from
    }
    this.logger_ = logger
    this.resend = new Resend(this.config_.apiKey)
  }

  async send(notification: NotificationTypes.ProviderSendNotificationDTO): Promise<NotificationTypes.ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `No notification information provided`)
    }
    if (notification.channel !== 'email') {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Only email notifications are supported`)
    }

    let emailContent: ReactNode

    try {
      emailContent = generateEmailTemplate(notification.template, notification.data)
    } catch (error) {
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Failed to generate email content`)
    }

    const emailOptions = notification.data.emailOptions as NotificationEmailOptions

    const message: CreateEmailOptions = {
      to: notification.to,
      from: this.config_.from,
      react: emailContent,
      subject: emailOptions.subject || 'Notification',
      headers: emailOptions.headers,
      replyTo: emailOptions.replyTo,
      cc: emailOptions.cc,
      bcc: emailOptions.bcc,
      tags: emailOptions.tags,
      text: emailOptions.text,
      attachments: notification.attachments?.map(attachment => ({
        content: attachment.content,
        filename: attachment.filename,
        content_type: attachment.content_type
      }))
    }

    try {
      await this.resend.emails.send(message)
      this.logger_.log(`✅ Email sent successfully to ${notification.to}`)
      return {}
    } catch (error) {
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Failed to send email: ${error}`)
    }
  }
}
