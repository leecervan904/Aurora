import { Body, Controller, Post } from '@nestjs/common'
import { MailerService } from './mailer.service'

@Controller('sys/mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendMail(@Body('email') email: string) {
    const result = await this.mailerService.sendMail(email, '123456')
    return { message: '邮件已发送', result }
  }
}
