import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })
  app.enableCors({
    credentials: true,
    origin: 'https://laster-marka.herokuapp.com'
  })
  app.use(cookieParser())
  await app.listen(process.env.PORT || 4000)
}
bootstrap()
