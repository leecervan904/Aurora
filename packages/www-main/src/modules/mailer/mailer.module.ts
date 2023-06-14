import { Module } from "@nestjs/common"
import { MailController } from "./mailer.controller"
import { MailerService } from "./mailer.service"

@Module({
  controllers: [MailController],
  providers: [MailerService]
})
export class MailerModule {}
