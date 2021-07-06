import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './services/user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './models/user.model'
import { CountrySchema } from './models/country.model'
import { ConfigSchema } from './models/config.model'
import { RoleSchema } from './models/role.model'
import { UserController } from './controllers/user.controller'
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenMiddleware } from './middlewares/token.middleware';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Configuration', schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: 'Country', schema: CountrySchema }]),
    JwtModule.register({ secret: jwtConstants.secret })
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .forRoutes(
        { path: 'user/:name', method: RequestMethod.GET },
        { path: 'user/edit/:name', method: RequestMethod.PUT },
        { path: 'user/edit/password/:name', method: RequestMethod.PUT },
        { path: 'user/delete/:name', method: RequestMethod.DELETE }
      )
  }
}
