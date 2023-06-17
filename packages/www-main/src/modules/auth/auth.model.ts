import { prop, modelOptions } from '@typegoose/typegoose';
import { IsString, IsDefined, IsOptional } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

export const DEFAULT_AUTH = Object.freeze<Auth>({
  name: '',
  slogan: '',
  avatar: '',
  phone: '',
});

@modelOptions({
  schemaOptions: {
    versionKey: false,
  },
})
export class Auth {
  @IsString({ message: "what's your name?" })
  @IsDefined()
  @prop({ required: true })
  name: string;

  @IsString()
  @IsDefined()
  @prop({ required: true })
  slogan: string;

  @IsString()
  @IsOptional()
  @prop({ default: '' })
  avatar: string;

  @IsString()
  @prop({ select: false })
  password?: string;

  @IsString()
  @prop({ required: true })
  phone: string;

  @IsString()
  @prop({ select: false })
  email?: string;
}

export const AuthProvider = getProviderByTypegooseClass(Auth);
