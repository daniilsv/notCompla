import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import * as ResizeStorage from './resize.storage';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [
    AuthModule,
    MulterModule.register({
      storage: ResizeStorage.storageEngine({
        destination: function (req, file, cb) {
          cb(null, '/app/uploads')
        },
      })
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule { }
