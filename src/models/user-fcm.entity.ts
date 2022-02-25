import { ApiProperty } from '@nestjs/swagger';
import { BelongsTo, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { User, UserRole } from './user.entity';

@Table
export class UserFcm extends Model {
  @PrimaryKey
  @Column
  token: string;

  @ApiProperty({ enum: UserRole })
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role: UserRole;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user: User;

  userId: number;
}
