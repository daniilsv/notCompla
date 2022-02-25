import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CacheService } from 'src/cache/cache.service';
import { ProjectItem } from 'src/models/project-item.entity';
import { ProjectSheet } from 'src/models/project-sheet.entity';
import { User } from 'src/models/user.entity';
import { NameRequest } from '../dto/sheet.dto';
import { ProjectService } from '../project/project.service';


@Injectable()
export class ProjectSheetService {
  constructor(
    private sequelize: Sequelize,
    private readonly projectService: ProjectService,
    private readonly cache: CacheService
  ) { }

  async addSheet(user: User, projectId: string, { name }: NameRequest): Promise<ProjectSheet> {
    await this.projectService.projectById(user, projectId);
    return ProjectSheet.create({ projectId: projectId, name });
  }

  async sheetById(user: User, sheetId: string, password?: string, isGet?: boolean): Promise<ProjectSheet> {
    const sheet = await this.cache.setCache(`sheet-${sheetId}`, ProjectSheet.findByPk(sheetId));
    await this.projectService.projectById(user, sheet.projectId, password, isGet);
    return sheet;
  }

  async getSheetItems(user: User, sheetId: string, password?: string): Promise<ProjectItem[]> {
    const sheet = await this.sheetById(user, sheetId, password, true);
    return ProjectItem.findAll({ where: { projectId: sheet.projectId, sheetId } });
  }

  async renameSheet(user: User, sheetId: string, { name }: NameRequest): Promise<boolean> {
    await this.sheetById(user, sheetId);
    const [num] = await ProjectSheet.update({ name }, { where: { id: sheetId } });
    this.cache.dropCache(`sheet-${sheetId}`);
    return num == 1;
  }

  async copySheet(user: User, sheetId: string): Promise<ProjectSheet> {
    const _sheet = await this.sheetById(user, sheetId);
    const _items = await ProjectItem.findAll({ where: { sheetId: _sheet.id } });

    let sheet: ProjectSheet;
    await this.sequelize.transaction(async (transaction) => {
      sheet = await ProjectSheet.create({ projectId: _sheet.projectId, name: 'Копия ' + _sheet.name, }, { transaction });
      for (const item of _items) {
        const _item: any = item.toJSON();
        delete _item.id;
        await ProjectItem.create({ ..._item, projectId: _sheet.projectId, sheetId: sheet.id, }, { transaction });
      }
    });
    return sheet;
  }

  async deleteSheet(user: User, sheetId: string) {
    const sheet = await this.sheetById(user, sheetId);
    await sheet.destroy();
    this.cache.dropCache(`sheet-${sheetId}`);
    return true;
  }
}
