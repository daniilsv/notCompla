import { Body, Controller, Delete, Get, Param, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Auth } from 'src/auth/role.decorator';
import { ProjectItem } from 'src/models/project-item.entity';
import { ProjectSheet } from 'src/models/project-sheet.entity';
import { User } from 'src/models/user.entity';
import { NameRequest } from '../dto/sheet.dto';
import { ProjectSheetService } from './sheet.service';

@Auth()
@ApiTags('project sheet')
@Controller('project/sheet')
export class ProjectSheetController {
  constructor(private readonly projectService: ProjectSheetService) { }

  @ApiOperation({ summary: 'Создание страницы проекта' })
  @Post('/create/:projectId')
  @ApiResponse({ status: 200, type: ProjectSheet })
  createSheet(
    @GetUser(ValidationPipe) user: User,
    @Param('projectId') projectId: string,
    @Body() dto: NameRequest,
  ) {
    return this.projectService.addSheet(user, projectId, dto);
  }

  @ApiOperation({ summary: 'Получение строк страницы' })
  @ApiResponse({ status: 200, type: [ProjectItem] })
  @Get('/:sheetId')
  getSheetItems(
    @GetUser(ValidationPipe) user: User,
    @Param('sheetId') sheetId: string,
    @Query('password') password: string,
  ): Promise<ProjectItem[]> {
    return this.projectService.getSheetItems(user, sheetId, password);
  }

  @ApiOperation({ summary: 'Изменение названия страницы' })
  @ApiResponse({ status: 200, type: Boolean })
  @Put('/:sheetId')
  updateSheet(
    @GetUser(ValidationPipe) user: User,
    @Param('sheetId') sheetId: string,
    @Body() dto: NameRequest,
  ): Promise<boolean> {
    return this.projectService.renameSheet(user, sheetId, dto);
  }

  @ApiOperation({ summary: 'Удаление страницы' })
  @ApiResponse({ status: 200, type: Boolean })
  @Delete('/:sheetId')
  removeSheet(
    @GetUser(ValidationPipe) user: User,
    @Param('sheetId') sheetId: string,
  ): Promise<boolean> {
    return this.projectService.deleteSheet(user, sheetId);
  }

  @ApiOperation({ summary: 'Копия страницы', description: 'Страница sheetId копируется вместе со всеми строками' })
  @Post('/:sheetId/copy')
  @ApiResponse({ status: 200, type: ProjectSheet })
  copySheet(
    @GetUser(ValidationPipe) user: User,
    @Param('sheetId') sheetId: string,
  ): Promise<ProjectSheet> {
    return this.projectService.copySheet(user, sheetId);
  }

}
