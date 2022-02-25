import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserFcm } from 'src/models/user-fcm.entity';
import { PushService } from './push.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserFcm]),
  ],
  providers: [PushService],
  exports: [PushService],
})
export class PushModule { }
