import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { UserService } from './services/user.service'
import { InjectModel, MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './models/user.model'
import { CountrySchema } from './models/country.model'
import { ConfigSchema } from './models/config.model'
import { RoleSchema } from './models/role.model'
import { UserController } from './controllers/user.controller'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TokenMiddleware } from './middlewares/token.middleware'
import { jwtConstants } from './middlewares/constants'
import { Model } from 'mongoose'
import { IUser } from './interfaces/user.interface'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Configuration', schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: 'Country', schema: CountrySchema }]),
    JwtModule.register({ secret: jwtConstants.secret, signOptions: { expiresIn: '1d' } })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
// export class UserModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TokenMiddleware)
//       .forRoutes(
//         { path: 'user/edit/:name', method: RequestMethod.PUT },
//         { path: 'user/edit/password/:name', method: RequestMethod.PUT },
//         { path: 'user/delete/:name', method: RequestMethod.DELETE }
//       )
//   }
// }
