import { prop, modelOptions, plugin } from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { generalAutoIncrementIDConfig } from '@app/constants/increment.constant';
import { IsString, IsDefined, IsOptional } from 'class-validator';
import { getProviderByTypegooseClass } from '@app/transformers/model.transformer';

@plugin(AutoIncrementID, generalAutoIncrementIDConfig)
@modelOptions({
  schemaOptions: {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  },
})
export class User {
  @prop({ unique: true })
  id: number;

  @IsString({ message: "what's your name?" })
  @IsDefined()
  @prop({ required: true })
  username: string;

  @IsString()
  @prop({ required: true })
  password: string;

  @IsString()
  @prop({ required: true })
  email: string;

  // @IsString()
  // @prop({ required: true })
  // phone: string;

  @IsString()
  @IsDefined()
  nickname?: string;

  @IsString()
  @IsOptional()
  @prop({ default: '' })
  avatar?: string;
}

export const UserProvider = getProviderByTypegooseClass(User);
