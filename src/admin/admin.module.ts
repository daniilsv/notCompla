import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/models/user.entity';
import { PushModule } from 'src/push/push.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [SequelizeModule.forFeature([User]), AuthModule, PushModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }
