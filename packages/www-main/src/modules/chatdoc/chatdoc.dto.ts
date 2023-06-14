import { ApiProperty } from "@nestjs/swagger"
import { PartialType, IntersectionType } from "@nestjs/mapped-types"
import { PaginationOptionDto } from "@app/models/paginate.model"
import { KeywordQueryDto, DocQueryDto } from "@app/models/query.model"

export class CreateChatdocDto {
  // @ApiProperty({ description: '用户ID' })
  // userId: number;

  @ApiProperty({ description: "问题" })
  question: string

  @ApiProperty({ description: "回答" })
  answer: string

  @ApiProperty({ description: "分类ID" })
  categoryIds: string[]

  @ApiProperty({ description: "标签ID" })
  tagIds: string[]
}

export class UpdateChatdocDto extends PartialType(CreateChatdocDto) {}

export class UpdateChatdocCategoryDto {
  @ApiProperty({ description: "修改类型" })
  type: "add" | "remove"

  @ApiProperty({ description: "分类ID" })
  id: number
}

export class UpdateChatdocTagDto {
  @ApiProperty({ description: "修改类型" })
  type: "add" | "remove"

  @ApiProperty({ description: "标签ID" })
  id: number
}

export class ChatdocPaginationQueryDto extends IntersectionType(
  PaginationOptionDto,
  KeywordQueryDto,
  DocQueryDto
) {}
