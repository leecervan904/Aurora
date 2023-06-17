// https://docs.nestjs.com/security/authentication#implementing-passport-jwt
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error';
import { UserService } from './user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'better-gpt',
    });
  }

  /**
   * 返回值会挂在 req.user 上
   * @param payload token 解码后的 data
   * @returns
   */
  validate(payload: any) {
    console.log(payload, 'jwt strategy');
    const data = this.userService.validateAuthData(payload);
    if (data) {
      return data;
    } else {
      throw new HttpUnauthorizedError();
    }
  }
}
