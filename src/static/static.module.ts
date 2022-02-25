import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Static } from 'src/models/static.entity';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
    imports: [SequelizeModule.forFeature([Static]), AuthModule],
    controllers: [StaticController],
    providers: [StaticService],
})
export class StaticModule { }
