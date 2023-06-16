import type { Types } from 'mongoose'
import { AutoIncrementID } from '@typegoose/auto-increment'
import { modelOptions, plugin, prop } from '@typegoose/typegoose'
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant'
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer'
import { mongoosePaginate } from '@app/utils/paginate'
import { KeyValueModel } from '@app/models/key-value.model'

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ChatdocCategory {
  @prop({ unique: true })
  id: number

  @IsInt()
  @prop({ required: true })
  userId: number

  @IsString()
  @IsNotEmpty()
  @prop({ required: true, validate: /\S+/ })
  name: string

  // @Matches(/^[a-zA-Z0-9-_]+$/)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty({ message: 'slug?' })
  // @prop({ required: true, validate: /^[a-zA-Z0-9-_]+$/, unique: true })
  slug: string

  @IsString()
  @prop({ default: '' })
  description: string

  @prop({ ref: ChatdocCategory, default: null })
  pid: Types.ObjectId

  // @prop({ default: Date.now, immutable: true })
  // create_at?: Date;

  // @prop({ default: Date.now })
  // update_at?: Date;

  @ArrayUnique()
  @IsArray()
  @prop({ _id: false, default: [], type: () => [KeyValueModel] })
  extends: KeyValueModel[]

  // for article aggregate
  articles_count?: number
}

export const ChatdocCategoryProvider
  = getProviderByTypegooseClass(ChatdocCategory)
