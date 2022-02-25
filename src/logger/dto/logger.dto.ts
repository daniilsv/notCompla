import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LoggerReqDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'мин: 0',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  offset = 0;

  @ApiPropertyOptional({
    type: Number,
    description: 'мин: 1, макс: 50',
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  @Type(() => Number)
  @IsNotEmpty()
  limit = 100;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  ipAddr: string;

  @IsOptional()
  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  resStatus: number;

  @IsOptional()
  @IsString()
  reqType: string;
}

export class AppLogReqDto {
  @ApiProperty({
    example: 'app log string',
  })
  @IsString()
  text: string;
}
