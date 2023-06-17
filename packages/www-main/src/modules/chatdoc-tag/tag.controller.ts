import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import { Responser } from '@app/decorators/responser.decorator'
import type { PaginateOptions, PaginateQuery } from '@app/utils/paginate'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import type { ChatdocTag } from './tag.model'
import { CreateTagDto, TagPaginationQueryDto, UpdateTagDto } from './tag.dto'
import { TagService } from './tag.service'

@ApiTags('User ChatDoc Tag')
@Controller('user/tag')
@UseGuards(AuthGuard('jwt'))
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiResponse({ status: 200, description: '创建成功' })
  @Post()
  create(@Req() req, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(+req.user.id, createTagDto)
  }

  @Get('all')
  findAll(@Req() req) {
    return this.tagService.findAll(+req.user.id)
  }

  @Get('page')
  @Responser.paginate()
  findMany(@Req() req, @Query() query: TagPaginationQueryDto) {
    console.log(req.user, 'user...')
    const { sort, page, pageSize, ...filters } = query
    const paginateQuery: PaginateQuery<ChatdocTag> = {}
    const paginateOptions: PaginateOptions = { page, pageSize, dateSort: sort }

    // 搜索
    if (filters.keyword) {
      const trimmed = filters.keyword.trim()
      const keywordRegExp = new RegExp(trimmed, 'i')
      paginateQuery.$or = [
        { name: keywordRegExp },
        { slug: keywordRegExp },
        { description: keywordRegExp },
      ]
    }

    return this.tagService.paginator(
      +req.user.id,
      paginateQuery,
      paginateOptions,
    )
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    console.log(req.user, 'req.user')
    return this.tagService.findOne(+req.user.id, +id)
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(+req.user.id, +id, updateTagDto)
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tagService.remove(+req.user.id, +id)
  }
}
