import { INotificationProvider } from '@medusajs/framework/types'
import { Resend } from 'resend'

class ResendProvider implements INotificationProvider {
  static identifier = 'resend' // 🔥 ДОЛЖЕН БЫТЬ 'resend'

  private resend: any
  private from: string

  constructor(options) {
    this.resend = new Resend(options.api_key)
    this.from = options.from
  }

  async sendNotification(to: string, templateData: any) {
    try {
      const emailData = {
        from: this.from,
        to,
        subject: templateData.emailOptions?.subject || 'Notification',
        html: templateData.html || `<p>${templateData.preview || 'No content'}</p>`,
      }

      const response = await this.resend.emails.send(emailData)
      return response
    } catch (error) {
      console.error('Resend Error:', error)
      throw new Error('Failed to send email via Resend')
    }
  }
}

export default ResendProvider