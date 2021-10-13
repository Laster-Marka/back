import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { MarkModule } from './mark/mark.module'
import { AppController } from './app.controller'
import { FolderModule } from './folder/folder.module'

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:temporaryadminpass@jscluster.r9ocu.mongodb.net/laster-marka',
      { useCreateIndex: true }
    ),
    UserModule,
    FolderModule,
    MarkModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
