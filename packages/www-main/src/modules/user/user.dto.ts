import {
  IsString,
  IsNotEmpty,
  IsMobilePhone,
  IsByteLength,
  IsDefined,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 一期先做短信登录
 * - 使用验证码快捷登录：用户名随机、密码邮箱等信息置空
 */
export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString({ message: 'must be string' })
  @IsNotEmpty({ message: 'should be not empty' })
  @IsDefined()
  username: string;

  // @IsString({ message: 'must be string' })
  // @IsNotEmpty({ message: 'should be not empty' })
  // @IsMobilePhone('zh-CN')
  // @IsDefined()
  // phone: string;

  // @IsString()
  // @IsByteLength(4, 6)
  // smsCode: string;

  @ApiProperty({ description: '密码' })
  @IsString({ message: 'must be string' })
  @IsNotEmpty({ message: 'should be not empty' })
  @IsDefined()
  password: string;

  @ApiProperty({ description: '邮箱' })
  @IsString({ message: 'must be string' })
  @IsDefined()
  email: string;

  @ApiProperty({ description: '邮箱验证码' })
  @IsString()
  // @IsByteLength(4, 6)
  code: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsString({ message: 'must be string' })
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ description: '头像' })
  @IsString({ message: 'must be string' })
  // @IsDefined()
  @IsOptional()
  avatar?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class SendEmailDto {
  @ApiProperty({ description: '邮箱' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('zh-CN')
  phone: string;
}

/**
 * 登录方式 - 手机验证码
 */
export class UserSmsLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('zh-CN')
  phone: string;

  @IsString()
  @IsByteLength(4, 6)
  smsCode: string;
}

export class UserLoginDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserLogoutDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  // @IsString()
  // @IsNotEmpty()
  // refreshToken: string;
}
