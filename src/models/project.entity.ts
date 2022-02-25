import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ProjectSheet } from './project-sheet.entity';
import { User } from './user.entity';

@Table({
  paranoid: true
})
export class Project extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @Column
  password: string;

  @ApiProperty()
  @Column
  cover: string;

  @ApiProperty()
  @Column
  clientName: string;

  @ApiProperty()
  @Column
  clientPhone: string;

  @ApiProperty()
  @Column
  clientEmail: string;

  @ApiProperty()
  @Column
  isPublic: boolean;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user: User;
  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => ProjectSheet, isArray: true })
  @HasMany(() => ProjectSheet, { as: 'sheets', foreignKey: 'projectId' })
  sheets: ProjectSheet[];
}
