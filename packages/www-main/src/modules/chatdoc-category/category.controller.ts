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
import { ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import type { PaginateOptions, PaginateQuery } from '@app/utils/paginate'

import { CategoryService } from './category.service'
import type { ChatdocCategory } from './category.model'
import {
  CategoryPaginationQueryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './category.dto'

@ApiTags('User ChatDoc Category')
@UseGuards(AuthGuard('jwt'))
@Controller('user/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(+req.user.id, createCategoryDto)
  }

  @Get('all')
  findAll(@Req() req) {
    return this.categoryService.findAll(req.user.id)
  }

  @Get('page')
  findMany(@Req() req, @Query() query: CategoryPaginationQueryDto) {
    const { sort, page, pageSize, ...filters } = query
    const paginateQuery: PaginateQuery<ChatdocCategory> = {}
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

    return this.categoryService.paginator(
      req.user.id,
      paginateQuery,
      paginateOptions,
    )
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.categoryService.findOne(req.user.id, +id)
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+req.user.id, +id, updateCategoryDto)
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.categoryService.remove(+req.user.id, +id)
  }
}
