import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsByteLength, IsMobilePhone } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

@modelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class UserSmsCode {
  @IsString()
  @IsMobilePhone('zh-CN')
  @prop({ required: true, unique: true })
  phone: string;

  @IsString()
  @IsByteLength(4, 6)
  @prop({ required: true, unique: true })
  code: string;

  @prop({ type: Date, expires: '30s', default: Date.now })
  createdAt: Date;
}

export const UserSmsCodeProvider = getProviderByTypegooseClass(UserSmsCode);
