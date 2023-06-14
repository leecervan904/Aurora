import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@app/transformers/model.transformer"
import { MongooseModel } from "@app/interfaces/mongoose.interface"
import { User } from "./user.model"
import { UserSmsCode } from "./models/user-sms-code.model"
import { BannedToken } from "./models/user-token.model"
import { UserMailerCode } from "./models/UserMailerCode.model"
import { MailerService } from "../mailer/mailer.service"
import { CategoryService } from "../chatdoc-category/category.service"

import {
  CreateUserDto,
  UpdateUserDto,
  SendSmsDto,
  UserSmsLoginDto,
  UserLogoutDto,
  SendEmailDto,
  UserLoginDto
} from "./user.dto"

import {
  generateRandomUserName,
  generateSmsCode,
  generateRandomCode
} from "@app/utils"
import { encrypt, checkPassword } from "@app/utils/encrypt"

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly categoryService: CategoryService,
    @InjectModel(User) private readonly userModel: MongooseModel<User>,
    @InjectModel(BannedToken)
    private readonly bannedToken: MongooseModel<BannedToken>,
    @InjectModel(UserSmsCode)
    private readonly userSmsCodeModel: MongooseModel<UserSmsCode>,
    @InjectModel(UserMailerCode)
    private readonly userMailerModel: MongooseModel<UserMailerCode>
  ) {}

  async findAll() {
    const users = await this.userModel
      .find()
      .select({
        _id: 0,
        id: 1,
        username: 1,
        nickname: 1,
        avatar: 1
      })
      .exec()

    return {
      users
    }
  }

  async findOne(id: number) {
    const user = await this.userModel
      .findOne({ id })
      .select({
        _id: 0,
        id: 1,
        username: 1,
        nickname: 1,
        avatar: 1
      })
      .exec()

    if (!user) {
      throw "用户不存在"
    }

    return { user }
  }

  /**
   * 基本信息修改
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const { nickname, email, avatar } = updateUserDto
    const user = await this.userModel.findOneAndUpdate(
      { id },
      {
        nickname,
        email,
        avatar
      }
    )

    if (!user) {
      throw "user not found"
    }

    return {
      status: "success",
      user: {
        id: user.id
      }
    }
  }

  async remove(id: number) {
    const removedUser = await this.userModel.findOneAndRemove({ id })
    if (!removedUser) {
      throw "用户不存在"
    }

    return {
      status: "success"
    }
  }

  /**
   * 签发 token
   * - 注册成功
   * - 登录成功
   * - token 刷新
   * @param data
   * @returns
   */
  createToken(data: any) {
    return {
      accessToken: this.jwtService.sign({ data }),
      expiresIn: 3600
    }
  }

  async validateAuthData(payload: { data: { username: string; id: number } }) {
    // console.log(payload, 'auth validate');
    const { username, id } = payload.data
    const existUser = await this.userModel.findOne({ username, id })
    return !!existUser ? payload.data : null
  }

  // async signup(createUserDto: CreateUserDto) {
  //   const { phone, smsCode } = createUserDto;

  //   const existPhone = await this.userModel.findOne({ phone });
  //   if (existPhone) {
  //     throw '手机号已被注册！';
  //   }

  //   let username = generateRandomUserName();
  //   const existUsername = await this.userModel.findOne({ username });
  //   // todo: 优化，防止用户名重复
  //   if (existUsername) {
  //     username = generateRandomUserName();
  //   }

  //   const existSmsCode = await this.userSmsCodeModel.findOne({
  //     phone,
  //     code: smsCode,
  //   });
  //   if (!existSmsCode) {
  //     throw '验证码已过期';
  //   }
  //   if (smsCode !== existSmsCode.code) {
  //     throw '验证码错误';
  //   }

  //   const newUser = await this.userModel.create({
  //     username,
  //     phone,
  //     nickname: username,
  //   });

  //   // 生成 token，前端处理重定向
  //   const accessToken = this.createToken({
  //     username: newUser.username,
  //     id: newUser.id,
  //   });

  //   return {
  //     id: newUser.id,
  //     username: newUser.username,
  //     accessToken,
  //   };
  // }

  /**
   * 手机验证码登录
   * @param userSmsLoginDto
   * @returns
   */
  // async loginWithSms(userSmsLoginDto: UserSmsLoginDto) {
  //   const { phone, smsCode } = userSmsLoginDto;

  //   const existUser = await this.userModel.findOne({ phone });
  //   if (!existUser) {
  //     throw '用户不存在';
  //   }

  //   const existSmsCode = await this.userSmsCodeModel.findOne({
  //     phone,
  //     code: smsCode,
  //   });
  //   if (!existSmsCode) {
  //     throw '验证码过期';
  //   }
  //   if (existSmsCode.code !== smsCode) {
  //     throw '验证码错误';
  //   }

  //   // 生成 token
  //   const accessToken = this.createToken({
  //     username: existUser.username,
  //     id: existUser.id,
  //   });

  //   return {
  //     username: existUser.username,
  //     accessToken,
  //   };
  // }

  // async sendSmsCode(sendSmsDto: SendSmsDto) {
  //   const { phone } = sendSmsDto;

  //   const existUserCode = await this.userSmsCodeModel.findOne({ phone });
  //   if (existUserCode) {
  //     throw '验证码已发送，请稍后重试';
  //   }

  //   const code = generateSmsCode(6);
  //   const newUserCode = await this.userSmsCodeModel.create({
  //     phone,
  //     code,
  //   });

  //   return {
  //     code: newUserCode.code,
  //   };
  // }

  async signup(createUserDto: CreateUserDto) {
    const { username, password, email, code } = createUserDto

    const existUser = await this.userModel.findOne({
      $or: [{ username }, { email }]
    })
    if (existUser) {
      throw "用户名或邮箱已被使用"
    }

    const mailerCode = await this.userMailerModel.findOne({ email, code })
    if (!mailerCode) {
      throw "验证码错误"
    }

    const encryptPassword = encrypt(password)

    const newUser = await this.userModel.create({
      username,
      password: encryptPassword,
      email
    })

    // 为用户创建一个默认的分类
    await this.categoryService.create(newUser.id, {
      name: "未分类",
      slug: "unclassified",
      description: "未分类"
    })

    // 生成 token，前端处理重定向
    const accessToken = this.createToken({
      username: newUser.username,
      id: newUser.id
    })

    return {
      userInfo: {
        id: newUser.id,
        name: newUser.username
      },
      token: accessToken
    }
  }

  async sendEmailCode(sendEmailDto: SendEmailDto) {
    const { email } = sendEmailDto
    const existUser = await this.userModel.findOne({ email })
    if (existUser) {
      throw "此邮箱已被注册"
    }

    // 前端控制发送频率，后端只做简单限流
    // const existEmailCode = await this.userMailerModel.findOne({ email });
    // if (existEmailCode) {
    //   throw '请不要重复发送验证码';
    // }

    const randomCode = generateRandomCode(6)
    await this.userMailerModel.create({ email, code: randomCode })

    await this.mailerService.sendMail(email, randomCode)

    return {
      message: "邮件已发送，请注意查收"
    }
  }

  // 检查用户名是否已被注册
  async checkUsernameValid(username: string) {
    if (!username) throw "用户名不能为空"

    const existUser = await this.userModel.findOne({ username })

    return {
      valid: !existUser
    }
  }

  // 检查邮箱是否已被注册
  async checkEmailValid(email: string) {
    if (!email) throw "邮箱不能为空"
    const existEmail = await this.userModel.findOne({ email })

    return {
      valid: !existEmail
    }
  }

  async login(userLoginDto: UserLoginDto) {
    const { username, password, email } = userLoginDto
    const query: any = {}

    if (username) {
      query.username = username
    } else if (email) {
      query.email = email
    } else {
      throw "必须填入用户名或邮箱"
    }

    const user = await this.userModel.findOne(query)
    if (!user || !checkPassword(user.password, password)) {
      throw "用户不存在或密码错误"
    }

    const accessToken = this.createToken({
      username: user.username,
      id: user.id
    })

    return {
      message: "登录成功",
      userInfo: {
        id: user.id,
        name: user.username
      },
      token: accessToken
    }
  }

  async logout(userLogoutDto: UserLogoutDto) {
    const { accessToken } = userLogoutDto
    await this._setTokenBanned(accessToken)

    return "success"
  }

  async _setTokenBanned(token: string, expires = 24 * 60 * 60 * 1000) {
    await this.bannedToken.create({
      token,
      expires
    })
  }
}
