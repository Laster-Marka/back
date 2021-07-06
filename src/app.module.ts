import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { MarkModule } from './mark/mark.module';
import { AppController } from './app.controller';
import { FolderModule } from './folder/folder.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/laster-nest', { useCreateIndex: true }),
    UserModule,
    FolderModule,
    MarkModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
