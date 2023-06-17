import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KeyValueModel } from '@app/models/key-value.model';
import { PaginationOptionDto } from '@app/models/paginate.model';
import { KeywordQueryDto } from '@app/models/query.model';

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  name: string;

  @ApiProperty({ description: '分类别名' })
  slug: string;

  @ApiProperty({ description: '分类描述' })
  description: string;

  @ApiPropertyOptional({ description: '扩展属性', type: KeyValueModel })
  extends?: KeyValueModel;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryPaginationQueryDto extends IntersectionType(
  PaginationOptionDto,
  KeywordQueryDto,
) {}
