import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { CacheModule } from 'src/cache/cache.module';
import { ProjectItem } from 'src/models/project-item.entity';
import { ProjectSheet } from 'src/models/project-sheet.entity';
import { Project } from 'src/models/project.entity';
import { PushModule } from 'src/push/push.module';
import { ProjectItemController } from './item/item.controller';
import { ProjectItemService } from './item/item.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectSheetController } from './sheet/sheet.controller';
import { ProjectSheetService } from './sheet/sheet.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, ProjectSheet, ProjectItem]), AuthModule, CacheModule, PushModule],
  controllers: [ProjectsController, ProjectController, ProjectSheetController, ProjectItemController],
  providers: [ProjectsService, ProjectService, ProjectSheetService, ProjectItemService]
})
export class ProjectModule { }
