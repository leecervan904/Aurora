/**
 * @file General extend model
 * @module model/extend
 * @author Surmon <https://github.com/surmon-china>
 */

import { IsIn, IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { SortType } from '@app/constants/biz.constant'
import { unknownToNumber } from '@app/transformers/value.transformer'

export class PaginateBaseOptionDto {
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  @Min(1)
  @IsInt()
  page?: number

  @Min(1)
  @Max(50)
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => +value)
  pageSize?: number
}

export class PaginationOptionDto extends PaginateBaseOptionDto {
  // @IsIn([SortType.Asc, SortType.Desc])
  // @IsInt()
  // @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortType.Asc | SortType.Desc
}

export class PaginateOptionWithHotSortDto extends PaginateBaseOptionDto {
  @IsIn([SortType.Asc, SortType.Desc, SortType.Hottest])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  sort?: SortType
}
