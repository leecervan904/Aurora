import { IntersectionType, PartialType } from '@nestjs/mapped-types'
import { KeyValueModel } from '@app/models/key-value.model'
import { PaginationOptionDto } from '@app/models/paginate.model'
import { KeywordQueryDto } from '@app/models/query.model'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateTagDto {
  @ApiProperty({ description: '标签名称' })
  name: string

  @ApiProperty({ description: '标签别名' })
  slug: string

  @ApiProperty({ description: '标签描述' })
  description: string

  @ApiPropertyOptional({ description: '扩展属性', type: KeyValueModel })
  extends?: KeyValueModel
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class TagPaginationQueryDto extends IntersectionType(
  PaginationOptionDto,
  KeywordQueryDto,
) {}
