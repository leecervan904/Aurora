import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ChatdocCategoryProvider } from './category.model';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ChatdocCategoryProvider],
})
export class CategoryModule {}
