import type jwt from 'jsonwebtoken';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProvider } from './user.model';
import { BannedTokenProvider } from './models/user-token.model';
import { UserSmsCodeProvider } from './models/user-sms-code.model';
import { UserMailerCodeProvider } from './models/UserMailerCode.model';
import { JwtStrategy } from './jwt.strategy';
import { MailerService } from '../mailer/mailer.service';
import { ChatdocCategoryProvider } from '../chatdoc-category/category.model';
import { CategoryService } from '../chatdoc-category/category.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      privateKey: 'better-gpt' as jwt.Secret,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserProvider,
    UserSmsCodeProvider,
    BannedTokenProvider,
    UserMailerCodeProvider,
    JwtStrategy,
    MailerService,
    CategoryService,
    ChatdocCategoryProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
