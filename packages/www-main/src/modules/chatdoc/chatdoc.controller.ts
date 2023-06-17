import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PaginateOptions, PaginateQuery } from '@app/utils/paginate';
import { ChatdocService } from './chatdoc.service';
import {
  CreateChatdocDto,
  UpdateChatdocDto,
  ChatdocPaginationQueryDto,
  UpdateChatdocCategoryDto,
  UpdateChatdocTagDto,
} from './chatdoc.dto';
import { Chatdoc } from './chatdoc.model';

@ApiTags('User ChatDoc')
@UseGuards(AuthGuard('jwt'))
@Controller('user/chatdoc')
export class ChatdocController {
  constructor(private readonly chatdocService: ChatdocService) {}

  @Post()
  create(@Req() req, @Body() createChatdocDto: CreateChatdocDto) {
    console.log(createChatdocDto, 'here');
    return this.chatdocService.create(+req.user.id, createChatdocDto);
  }

  @Get('all')
  findAll(@Req() req) {
    return this.chatdocService.findAll(+req.user.id);
  }

  @Get('page')
  findMany(@Req() req, @Query() query: ChatdocPaginationQueryDto) {
    const { sort, page, pageSize, category, tag, ...filters } = query;

    const paginateQuery: PaginateQuery<Chatdoc> = {};
    const paginateOptions: PaginateOptions = { page, pageSize, dateSort: sort };

    if (category || tag) {
      paginateQuery.$and = [];

      if (category) {
        paginateQuery.$and.push({ categoryIds: { $in: [category] } });
      }

      if (tag) {
        paginateQuery.$and.push({ tagIds: { $in: [tag] } });
      }
    }

    // 搜索
    if (filters.keyword) {
      const trimmed = filters.keyword.trim();
      const keywordRegExp = new RegExp(trimmed, 'i');
      paginateQuery.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp },
      ];
    }

    return this.chatdocService.paginator(
      req.user.id,
      paginateQuery,
      paginateOptions,
    );
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.chatdocService.findOne(+req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateChatdocDto: UpdateChatdocDto,
  ) {
    return this.chatdocService.update(+req.user.id, +id, updateChatdocDto);
  }

  @Patch(':id/category')
  updateCategory(
    @Req() req,
    @Param('id') id: string,
    @Body() updateChatdocCategoryDto: UpdateChatdocCategoryDto,
  ) {
    return this.chatdocService.updateCategoryOrTag(
      +req.user.id,
      +id,
      'category',
      updateChatdocCategoryDto,
    );
  }

  @Patch(':id/tag')
  updateTag(
    @Req() req,
    @Param('id') id: string,
    @Body() updateChatdocTagDto: UpdateChatdocTagDto,
  ) {
    return this.chatdocService.updateCategoryOrTag(
      +req.user.id,
      +id,
      'tag',
      updateChatdocTagDto,
    );
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.chatdocService.remove(+req.user.id, +id);
  }
}
