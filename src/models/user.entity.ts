import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Column, DataType, HasMany, Model, PrimaryKey, Scopes, Table, Unique } from 'sequelize-typescript';
import { Project } from './project.entity';

export enum UserRole { designer = 'designer', admin = 'admin' }

@Scopes(() => ({
  withProjects: {
    include: [
      { model: Project, as: 'projects' }
    ]
  }
}))
@Table({
  paranoid: true,
  updatedAt: true,
})
export class User extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  id: string;

  @ApiProperty()
  @Unique
  @Column
  email: string;

  @Column
  set password(value: string) {
    if (value == null) this.setDataValue('password', null);
    else this.setDataValue('password', bcrypt.hashSync(value, bcrypt.genSaltSync(10)));
  }

  @Column
  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  @Column
  name: string;

  @ApiProperty()
  @Column
  surname: string;

  @ApiProperty()
  @Column
  patronymic: string;

  @ApiProperty({ type: () => Project, isArray: true })
  @HasMany(() => Project, { as: 'projects', foreignKey: 'userId' })
  projects: Array<Project>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  @Column
  registeredAt: Date;

  public checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.getDataValue('password'));
  }
}
