import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SignUpRequest {

  @ApiProperty()
  @IsString()
  @IsUUID(4)
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'some@email.ma' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
