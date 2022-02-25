import { Body, Controller, Delete, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Auth } from 'src/auth/role.decorator';
import { ProjectItem } from 'src/models/project-item.entity';
import { ProjectSheet } from 'src/models/project-sheet.entity';
import { User } from 'src/models/user.entity';
import { ProjectItemService } from './item.service';

@Auth()
@ApiTags('project item')
@Controller('project/item')
export class ProjectItemController {
  constructor(private readonly itemService: ProjectItemService) { }

  @ApiOperation({ summary: 'Создание строки' })
  @Post('/create/:sheetId')
  @ApiResponse({ status: 200, type: ProjectItem })
  createItem(
    @GetUser(ValidationPipe) user: User,
    @Param('sheetId') sheetId: string,
    @Body() dto: ProjectItem
  ): Promise<ProjectItem> {
    return this.itemService.addItem(user, sheetId, dto);
  }

  @ApiOperation({ summary: 'Изменение строки' })
  @Put('/:itemId')
  @ApiResponse({ status: 200, type: Boolean })
  updateItem(
    @GetUser(ValidationPipe) user: User,
    @Param('itemId') itemId: string,
    @Body() dto: ProjectItem
  ): Promise<boolean> {
    return this.itemService.updateItem(user, itemId, dto);
  }

  @ApiOperation({ summary: 'Удаление строки' })
  @Delete('/:itemId')
  removeItem(
    @GetUser(ValidationPipe) user: User,
    @Param('itemId') itemId: string,
  ) {
    return this.itemService.deleteItem(user, itemId);
  }

  @ApiOperation({ summary: 'Копия строки', description: 'Строка dto.id копируется на страницу dto.sheetId' })
  @Post('/:itemId/copy/:sheetId')
  @ApiResponse({ status: 200, type: ProjectItem })
  copyItem(
    @GetUser(ValidationPipe) user: User,
    @Param('itemId') itemId: string,
    @Param('sheetId') sheetId: string,
  ) {
    return this.itemService.copyItem(user, itemId, sheetId);
  }

  @ApiOperation({ summary: 'Перемещение строки', description: 'Строка dto.id перемещается на страницу dto.sheetId' })
  @Post('/:itemId/move/:sheetId')
  @ApiResponse({ status: 200, type: Boolean })
  moveItem(
    @GetUser(ValidationPipe) user: User,
    @Param('itemId') itemId: string,
    @Param('sheetId') sheetId: string,
  ) {
    return this.itemService.moveItem(user, itemId, sheetId);
  }
}
