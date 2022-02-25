import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ProjectItem } from './project-item.entity';
import { Project } from './project.entity';

@Table({
  updatedAt: false,
  paranoid: true
})
export class ProjectSheet extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @BelongsTo(() => Project, { as: 'project', foreignKey: 'projectId' })
  project: Project;
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty({ type: () => ProjectItem, isArray: true })
  @HasMany(() => ProjectItem, { as: 'items', foreignKey: 'sheetId' })
  items: ProjectItem[];
}
