import { NestFactory } from "@nestjs/core"
import { ErrorInterceptor } from "@app/interceptors/error.interceptor"
import { HttpExceptionFilter } from "@app/filters/error.filter"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { config } from "dotenv"
import { ValidationPipe } from "@nestjs/common"
// import { ValidationPipe } from '@app/pipe/validate.pipe';
// import rateLimit from 'express-rate-limit';
// import { TransformInterceptor } from '@app/interceptors/transform.interceptor';

config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ["https://chat.lizhiwen.online"], // 允许的来源
    // methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'], // 允许的 HTTP 方法
    // allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
    // exposedHeaders: ['Content-Length'], // 允许的响应头
    credentials: true // 是否允许发送凭据（如 Cookies）
    // maxAge: 86400, // 指定预检请求的有效期时间，单位秒
  })

  const config = new DocumentBuilder()
    .setTitle("ChatDoc API")
    .setDescription("The ChatDoc API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
      // disableErrorMessages: true,
    })
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new ErrorInterceptor())
  await app.listen(process.env.NEST_APP_PORT || 3000)
}

bootstrap()
