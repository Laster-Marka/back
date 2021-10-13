import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { MarkController } from './controllers/mark.controller'
import { MarkService } from './services/mark.service'
import { MongooseModule } from '@nestjs/mongoose'
import { MarkSchema } from './models/mark.model'
import { TagSchema } from './models/tag.model'
import { TypeSchema } from './models/type.model'
import { FolderModule } from '../folder/folder.module'
import { TokenMiddleware } from '../user/middlewares/token.middleware'
import { CreateMarkDtoToMarkMapper } from './dto/create-mark-dto-to-mark'
import { UserModule } from '../user/user.module'
import { EditMarkDtoToMarkMapper } from './dto/edit-mark-dto-to-mark'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }]),
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    MongooseModule.forFeature([{ name: 'Type', schema: TypeSchema }]),
    FolderModule,
    UserModule
  ],
  controllers: [MarkController],
  providers: [MarkService, CreateMarkDtoToMarkMapper, EditMarkDtoToMarkMapper],
  exports: [MarkService]
})
export class MarkModule {}
// export class MarkModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(TokenMiddleware)
//       .forRoutes(
//         { path: 'mark', method: RequestMethod.POST },
//         { path: 'mark/:id', method: RequestMethod.GET },
//         { path: 'mark/:id', method: RequestMethod.PUT },
//         { path: 'mark/:name', method: RequestMethod.DELETE }
//       )
//   }
// }
