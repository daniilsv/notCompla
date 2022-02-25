import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Auth, OptionalAuth } from 'src/auth/role.decorator';
import { ProjectItem } from 'src/models/project-item.entity';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
import { PasswordRequest } from '../dto/password.dto';
import { ProjectService } from './project.service';

@ApiTags('project')
@Controller('project/:projectId')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  @Auth()
  @ApiOperation({ summary: 'Создание проекта' })
  @ApiResponse({ status: 200, type: Project })
  @Post('/create')
  create(
    @GetUser(ValidationPipe) user: User,
    @Body() project: Project
  ): Promise<Project> {
    return this.projectService.create(user, project);
  }

  @OptionalAuth()
  @ApiOperation({ summary: 'Получение проекта по ID' })
  @ApiResponse({ status: 200, type: Project })
  @Get()
  findProject(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Query('password') password: string,
  ): Promise<Project> {
    return this.projectService.findProject(user, projectId, password);
  }

  @OptionalAuth()
  @ApiOperation({ summary: 'Получение суммы по страницам' })
  @ApiResponse({ status: 200, type: Object })
  @Get('/total')
  totalAmount(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Query('password') password: string,
  ): Promise<Record<string, number>> {
    return this.projectService.totalAmount(user, projectId, password);
  }

  @OptionalAuth()
  @ApiOperation({ summary: 'Получение всех строк' })
  @ApiResponse({ status: 200, type: [ProjectItem] })
  @Get('/items')
  items(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Query('password') password: string,
  ): Promise<ProjectItem[]> {
    return this.projectService.getItems(user, projectId, password);
  }

  @Auth()
  @ApiOperation({ summary: 'Шеринг проекта на почту' })
  @ApiResponse({ status: 200, type: [ProjectItem] })
  @Post('/share/:email')
  share(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Query('password') password: string,
    @Param('email') email: string,
  ): Promise<boolean> {
    return this.projectService.share(user, projectId, email, password);
  }

  @Auth()
  @ApiOperation({ summary: 'Задание пароля проекта' })
  @Post('/setPassword')
  setPassword(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Body() dto: PasswordRequest
  ) {
    return this.projectService.setPassword(user, projectId, dto.password);
  }

  @Auth()
  @ApiOperation({ summary: 'Удаление пароля проекта' })
  @Post('/removePassword')
  removePassword(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.removePassword(user, projectId);
  }

  @Auth()
  @ApiOperation({ summary: 'Изменение проекта' })
  @Put()
  @ApiResponse({ status: 200, type: Project })
  update(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Body() project: Project
  ) {
    return this.projectService.update(user, projectId, project);
  }

  @Auth()
  @ApiOperation({ summary: 'Удаление проекта' })
  @Delete()
  @ApiResponse({ status: 200, type: Boolean })
  remove(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string
  ) {
    return this.projectService.remove(user, projectId);
  }
}
