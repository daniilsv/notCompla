import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ProjectSheet } from './project-sheet.entity';
import { Project } from './project.entity';

@Table({
  updatedAt: false,
  paranoid: true
})
export class ProjectItem extends Model {
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
  @ApiPropertyOptional()
  projectId: string;

  @BelongsTo(() => ProjectSheet, { as: 'projectSheet', foreignKey: 'projectSheetId' })
  sheet: ProjectSheet;
  @ApiPropertyOptional()
  sheetId: string;

  @ApiPropertyOptional()
  @Column(DataType.TEXT)
  name: string;

  @ApiPropertyOptional()
  @Column(DataType.TEXT)
  link: string;

  @ApiPropertyOptional()
  @Column(DataType.TEXT)
  image: string;

  @ApiPropertyOptional()
  @Column
  count: number;

  @ApiPropertyOptional()
  @Column
  unit: string;

  @ApiPropertyOptional()
  @Column(DataType.TEXT)
  description: string;

  @ApiPropertyOptional()
  @Column
  provider: string;

  @ApiPropertyOptional()
  @Column
  paymentStage: string;

  @ApiPropertyOptional()
  @Column(DataType.FLOAT)
  price: number;
}
