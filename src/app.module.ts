import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { MarkModule } from './mark/mark.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/laster-nest', { useCreateIndex: true }),
    UserModule,
    MarkModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
