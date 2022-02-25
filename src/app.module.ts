import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule, SequelizeModuleOptions } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import configDefault from '../config/default';
import configProduction from '../config/production';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { Log } from './models/log.model';
import { StaticModule } from './static/static.module';
import { UploadsModule } from './uploads/uploads.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { AdminModule } from './admin/admin.module';
import { CacheModule } from './cache/cache.module';


const config =
  process.env.NODE_ENV === 'production' ? configProduction : configDefault;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          dialect: config.get('database.dialect'),
          host: config.get('database.host'),
          port: config.get('database.port'),
          username: config.get('database.username'),
          password: config.get('database.password'),
          database: config.get('database.database'),
          synchronize: config.get('database.synchronize'),
          logging: config.get('database.logging'),
          benchmark: false,
          autoLoadModels: true,
        } as SequelizeModuleOptions;
      },
    }),
    ScheduleModule.forRoot(),
    SequelizeModule.forFeature([Log]),
    ServeStaticModule.forRoot(
      {
        serveRoot: '/uploads',
        rootPath: join(__dirname, '..', '..', 'uploads'),
      },
      {
        serveRoot: '/logs',
        rootPath: join(__dirname, '..', '..', 'src', 'logger', 'public'),
      }
    ),
    AuthModule,
    UserModule,
    UploadsModule,
    StaticModule,
    LoggerModule,
    ProjectModule,
    AdminModule,
    CacheModule,
  ],
})
export class AppModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'logs', method: RequestMethod.ALL }, { path: 'logs/(.*)', method: RequestMethod.ALL }, { path: 'uploads/(.*)', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
