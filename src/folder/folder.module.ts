import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { FolderController } from './controllers/folder.controller';
import { FolderService } from './services/folder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderSchema } from './models/folder.model';
import { ColorSchema } from './models/color.model';
import { UserModule } from '../user/user.module';
import { TokenMiddleware } from '../user/middlewares/token.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Folder', schema: FolderSchema }]),
    MongooseModule.forFeature([{ name: 'Color', schema: ColorSchema }]),
    UserModule
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService]
})
export class FolderModule {}
// export class FolderModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TokenMiddleware)
//       .forRoutes(
//         // { path: 'folder', method: RequestMethod.POST },
//         { path: 'folder/:id', method: RequestMethod.GET },
//         { path: 'folder/:id', method: RequestMethod.PUT },
//         { path: 'folder/:name', method: RequestMethod.DELETE }
//       )
//   }
// }
