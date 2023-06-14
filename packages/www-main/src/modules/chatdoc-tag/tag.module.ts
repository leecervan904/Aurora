import { Module } from "@nestjs/common"
import { TagService } from "./tag.service"
import { TagController } from "./tag.controller"
import { ChatdocTagProvider } from "./tag.model"
// import { UserService } from '../user/user.service';

@Module({
  controllers: [TagController],
  providers: [TagService, ChatdocTagProvider]
})
export class TagModule {}
