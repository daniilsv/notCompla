import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { ProjectItem } from 'src/models/project-item.entity';
import { User } from 'src/models/user.entity';
import { ProjectSheetService } from '../sheet/sheet.service';


@Injectable()
export class ProjectItemService {
  constructor(
    private readonly sheetService: ProjectSheetService,
    private readonly cache: CacheService
  ) { }

  async addItem(user: User, sheetId: string, dto: ProjectItem): Promise<ProjectItem> {
    const sheet = await this.sheetService.sheetById(user, sheetId);
    return ProjectItem.create({ ...dto.toJSON(), sheetId, projectId: sheet.projectId });
  }

  async itemById(user: User, itemId: string): Promise<ProjectItem> {
    const item = await this.cache.setCache(`item-${itemId}`, ProjectItem.findByPk(itemId));
    await this.sheetService.sheetById(user, item.sheetId);
    return item;
  }

  async updateItem(user: User, itemId: string, dto: ProjectItem): Promise<boolean> {
    const item = await this.itemById(user, itemId);
    const _it: any = dto.toJSON();
    if (_it.image && _it.image == '') _it.image = null;
    await item.update({ ..._it });
    this.cache.dropCache(`item-${itemId}`);
    return true;
  }

  async deleteItem(user: User, itemId: string): Promise<boolean> {
    const item = await this.itemById(user, itemId);
    await item.destroy();
    this.cache.dropCache(`item-${itemId}`);
    return true;
  }

  async moveItem(user: User, itemId: string, sheetId: string): Promise<boolean> {
    const item = await this.itemById(user, itemId);
    await item.update({ sheetId });
    this.cache.dropCache(`item-${itemId}`);
    return true;
  }

  async copyItem(user: User, itemId: string, sheetId: string): Promise<ProjectItem> {
    const _item = await this.itemById(user, itemId);
    const _it: any = _item.toJSON();
    delete _it.id;
    const item = await ProjectItem.create({ ..._it, sheetId: sheetId });
    return item;
  }

}
