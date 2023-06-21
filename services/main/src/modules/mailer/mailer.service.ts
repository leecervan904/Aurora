import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('MAIL_HOST'), // 邮箱的SMTP服务器地址
      port: configService.get('MAIL_PORT'), // 端口号
      secure: true, // 是否使用 SSL
      auth: {
        user: configService.get('MAIL_AUTH_USER'), // 发送邮件的邮箱账号
        pass: configService.get('MAIL_AUTH_PASS'), // 发送邮件的邮箱密码
      },
    })
  }

  async sendMail(to: string, code: string) {
    const mailOptions = {
      from: this.configService.get('MAIL_AUTH_USER'), // 发件人邮箱地址
      to, // 收件人邮箱地址
      subject: '邮件验证码', // 邮件主题
      text: `您的验证码为：${code}`, // 邮件正文
    }
    const result = await this.transporter.sendMail(mailOptions)
    return result
  }
}
