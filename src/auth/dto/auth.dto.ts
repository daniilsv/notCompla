import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/models/user.entity';

export class AuthRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firebaseToken: string;
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;
}
