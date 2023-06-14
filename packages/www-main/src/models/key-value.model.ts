import { ApiProperty } from "@nestjs/swagger"
import { prop } from "@typegoose/typegoose"
import { IsString, IsNotEmpty } from "class-validator"

export class KeyValueModel {
  @ApiProperty({ description: "键" })
  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  name: string

  @ApiProperty({ description: "值" })
  @IsString()
  @IsNotEmpty()
  @prop({ required: false, validate: /\S+/ })
  value: string
}
