import { Module } from '@nestjs/common'
import { ChatdocTagProvider } from '../chatdoc-tag/tag.model'
import { ChatdocCategoryProvider } from '../chatdoc-category/category.model'
import { ChatdocService } from './chatdoc.service'
import { ChatdocController } from './chatdoc.controller'
import { ChatdocProvider } from './chatdoc.model'

@Module({
  controllers: [ChatdocController],
  providers: [
    ChatdocService,
    ChatdocProvider,
    ChatdocCategoryProvider,
    ChatdocTagProvider,
  ],
})
export class ChatdocModule {}
