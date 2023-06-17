import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Responser } from '@app/decorators/responser.decorator'

import { UserService } from './user.service'
import {
  CreateUserDto,
  SendEmailDto,
  UpdateUserDto,
  UserLoginDto,
  UserLogoutDto,
} from './user.dto'

@ApiTags('User')
// @UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }

  @Post('email')
  sendEmailCode(@Body() sendEmailDto: SendEmailDto) {
    return this.userService.sendEmailCode(sendEmailDto)
  }

  // @Post('sms')
  // sendSmsCode(@Body() sendSmsDto: SendSmsDto) {
  //   return this.userService.sendSmsCode(sendSmsDto);
  // }

  // @Post('login/sms')
  // loginWithSms(@Body() userSmsLoginDto: UserSmsLoginDto) {
  //   return this.userService.loginWithSms(userSmsLoginDto);
  // }

  @Post('signup')
  @Responser.handle({
    message: 'signup',
    error: HttpStatus.NOT_FOUND,
  })
  signup(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto);
    return this.userService.signup(createUserDto)
  }

  @Post('login')
  login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto)
  }

  @Post('logout')
  logout(@Body() userLogoutDto: UserLogoutDto) {
    return this.userService.logout(userLogoutDto)
  }

  @Post('token/renewal')
  @UseGuards(AuthGuard('jwt'))
  refreshToken(@Req() req) {
    return this.userService.createToken(req.user)
  }
}
