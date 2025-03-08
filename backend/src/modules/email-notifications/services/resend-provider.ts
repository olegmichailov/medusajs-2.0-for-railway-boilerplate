import { INotificationProvider } from '@medusajs/framework/types'
import Resend from 'resend'

class ResendProvider implements INotificationProvider {
  static identifier = 'resend'

  constructor(private readonly options) {}

  async sendNotification(to: string, template: string, data: any) {
    try {
      const resend = new Resend(this.options.api_key)

      await resend.emails.send({
        from: this.options.from,
        to,
        subject: data.emailOptions?.subject || 'Your Order Confirmation',
        html: `<h1>Thank you for your order!</h1><p>Your order ID: ${data.order.id}</p>`
      })

      console.log(`✅ Email sent to ${to} via Resend`)
    } catch (error) {
      console.error('❌ Error sending email via Resend:', error)
      throw error
    }
  }
}

export default ResendProvider