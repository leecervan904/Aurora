import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsByteLength, IsEmail } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

@modelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class UserMailerCode {
  @IsString()
  @IsEmail()
  @prop({ required: true, unique: true })
  email: string;

  @IsString()
  @IsByteLength(4, 6)
  @prop({ required: true, unique: true })
  code: string;

  @prop({ type: Date, expires: '10min', default: Date.now })
  createdAt: Date;
}

export const UserMailerCodeProvider =
  getProviderByTypegooseClass(UserMailerCode);
