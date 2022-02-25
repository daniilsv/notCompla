import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Auth } from 'src/auth/role.decorator';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
import { ProjectsService } from './projects.service';

@Auth()
@ApiTags('projects')
@Controller('project')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) { }

  @ApiOperation({ summary: 'Получение проектов юзера' })
  @ApiResponse({ status: 200, type: [Project] })
  @Get('/findAll')
  findAll(
    @GetUser(ValidationPipe) user: User,
  ): Promise<Project[]> {
    return this.projectsService.findAll(user);
  }
}
