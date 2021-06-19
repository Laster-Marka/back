import { Module } from '@nestjs/common';
import { MarkController } from './controllers/mark.controller';
import { MarkService } from './services/mark.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MarkSchema } from './models/mark.model';
import { TagSchema } from './models/tag.model';
import { TypeSchema } from './models/type.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Mark', schema: MarkSchema }]),
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    MongooseModule.forFeature([{ name: 'Type', schema: TypeSchema }])
  ],
  controllers: [MarkController],
  providers: [MarkService]
})
export class MarkModule {}
