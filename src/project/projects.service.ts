import { Injectable } from '@nestjs/common';
import { Project } from 'src/models/project.entity';
import { User } from 'src/models/user.entity';

@Injectable()
export class ProjectsService {
  findAll(user: User): Promise<Project[]> {
    return Project.findAll({
      where: user.isAdmin ? {} : { userId: user.id }
    });
  }
}
