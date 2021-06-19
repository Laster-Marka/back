import { Module } from '@nestjs/common';
import { FolderController } from './controllers/folder.controller';
import { FolderService } from './services/folder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderSchema } from './models/folder.model';
import { ColorSchema } from './models/color.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Folder', schema: FolderSchema }]),
    MongooseModule.forFeature([{ name: 'Color', schema: ColorSchema }]),
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService]
})
export class FolderModule {}
