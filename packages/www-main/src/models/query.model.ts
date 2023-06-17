import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { unknownToNumber } from '@app/transformers/value.transformer'

export const enum BooleanNumberValue {
  False = 0, // Number(false)
  True = 1, // Number(true)
}

// https://www.progress.com/blogs/understanding-iso-8601-date-and-time-format
export class DateQueryDto {
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  date?: string
}

export class KeywordQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  keyword?: string
}

export class DocQueryDto {
  @IsString()
  @IsOptional()
  category?: string

  @IsString()
  @IsOptional()
  tag?: string
}

// MARK: example
export class BooleanQueryDto {
  @IsIn([BooleanNumberValue.True, BooleanNumberValue.False])
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => unknownToNumber(value))
  boolean?: BooleanNumberValue.True | BooleanNumberValue.False
}
