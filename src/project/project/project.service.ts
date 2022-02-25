import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { CacheService } from 'src/cache/cache.service';
import { ProjectItem } from 'src/models/project-item.entity';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';
import { PushService } from 'src/push/push.service';


@Injectable()
export class ProjectService {
  constructor(
    private readonly cache: CacheService,
    private pushService: PushService
  ) { }

  create(user: User, project: Project): Promise<Project> {
    return Project.create({ ...project.toJSON(), userId: user.id });
  }

  async findProject(user: User, projectId: string, password: string): Promise<Project> {
    const project = await Project.findByPk(projectId);
    Logger.log(project.toJSON());
    if (user.id == project.userId
      || project.isPublic
      || user.isAdmin
      || (!!project.password && project.password == password)
    ) {
      const _project: any = project.toJSON();
      _project.sheets = await project.$get('sheets');
      return _project;
    }
    throw new ForbiddenException('У вас нет прав на доступ к этому проекту');
  }

  async projectById(user: User, projectId: string, password?: string, isGet?: boolean): Promise<Project> {
    const project = await this.cache.setCache(`project-${projectId}`, Project.findByPk(projectId));
    if (isGet) {
      if (user.id == project.userId
        || project.isPublic
        || user.isAdmin
        || (!!project.password && project.password == password)
      )
        return project;
    }
    if (user.id != project.userId && !user.isAdmin && (!!project.password && project.password != password))
      throw new ForbiddenException('Нет доступа к проекту');
    return project;
  }

  async getItems(user: User, projectId: string, password?: string): Promise<ProjectItem[]> {
    await this.projectById(user, projectId, password, true);
    return ProjectItem.findAll({ where: { projectId: projectId } });
  }

  async share(user: User, projectId: string, email: string, password?: string): Promise<boolean> {
    const project = await this.projectById(user, projectId, password, true);
    try {
      await this.pushService.sendMail(email, 'Приглашение в проект', { id: 188299, variables: { link: `some.ru/#/project/${projectId}`, title: project.name } });
      return true;
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  async setPassword(user: User, projectId: string, password: string) {
    const project = await this.projectById(user, projectId);
    await project.update({ password });
    this.cache.dropCache(`project-${projectId}`);
    return project;
  }
  async removePassword(user: User, projectId: string) {
    const project = await this.projectById(user, projectId);
    await project.update({ password: null });
    this.cache.dropCache(`project-${projectId}`);
    return project;
  }

  async update(user: User, projectId: string, _project: Project): Promise<Project> {
    const project = await this.projectById(user, projectId);
    const _it: any = _project.toJSON();
    if (_it.cover && _it.cover == '') _it.cover = null;
    await project.update({ ..._it });
    this.cache.dropCache(`project-${projectId}`);
    return project;
  }

  async remove(user: User, projectId: string): Promise<boolean> {
    const project = await this.projectById(user, projectId);
    await project.destroy();
    this.cache.dropCache(`project-${projectId}`);
    return true;
  }

  async totalAmount(user: User, projectId: string, password?: string): Promise<Record<string, number>> {
    await this.projectById(user, projectId, password, true);
    const totalAmount: any = await ProjectItem.findAll({
      where: { projectId },
      attributes: [
        'sheetId',
        [Sequelize.literal('SUM(COALESCE(count,1) * COALESCE(price,0))'), 'amount'],
      ],
      raw: true,
      group: ['sheetId'],
    });
    const total: Record<string, number> = {};
    for (const sh of totalAmount) {
      total[sh.sheetId] = parseFloat(sh.amount);
    }
    return total;
  }
}
