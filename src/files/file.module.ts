import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { FILE_CONFIG } from './config/file.config';

@Module({
  imports: [
    MulterModule.register({
      dest: FILE_CONFIG.STORAGE_PATH,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
