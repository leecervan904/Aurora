import { prop, modelOptions, plugin, Ref } from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';
import { ChatdocCategory } from '@app/modules/chatdoc-category/category.model';
import { ChatdocTag } from '@app/modules/chatdoc-tag/tag.model';
import { mongoosePaginate } from '@app/utils/paginate';

@plugin(mongoosePaginate)
@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    toObject: { getters: true },
    timestamps: true,
  },
})
export class Chatdoc {
  @IsInt()
  @prop({ unique: true })
  id: number;

  @IsInt()
  @prop({ required: true, index: true })
  userId: number;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  question: string;

  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  answer: string;

  @prop({
    ref: ChatdocCategory,
    // index: true,
    default: null,
  })
  categoryIds: Ref<ChatdocCategory>[];

  @prop({
    ref: ChatdocTag,
    // index: true,
    default: null,
  })
  tagIds: Ref<ChatdocTag>[];

  // @prop({
  //   ref: () => ChatdocTag,
  //   // foreignField: 'tags',
  //   index: true,
  //   default: null,
  // })
  // tagIds: Ref<ChatdocTag>[];
  // // tags: Ref<ChatdocTag>[];
}

export const ChatdocProvider = getProviderByTypegooseClass(Chatdoc);
