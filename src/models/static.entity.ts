import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Static extends Model {
  @ApiProperty()
  @PrimaryKey
  @Column
  key: string;

  @ApiProperty()
  @Column
  value: string;
}
