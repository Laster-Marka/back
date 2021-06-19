import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from './models/user.model'
import { CountrySchema } from './models/country.model'
import { ConfigSchema } from './models/config.model'
import { RoleSchema } from './models/role.model'
import { UserController } from './controllers/user.controller'
import { JwtModule } from '@nestjs/jwt';
import { FolderModule } from '../folder/folder.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Configuration', schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: 'Country', schema: CountrySchema }]),
    JwtModule.register({ secret: 'tempSecret' }),
    FolderModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
