import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthRequest, AuthResponse } from './dto/auth.dto';
import { PassAuthRequest } from './dto/pass-auth.dto';
import { SignUpRequest } from './dto/sign-up.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/signin')
  @ApiResponse({ status: 200, type: AuthResponse })
  login(
    @Body(ValidationPipe) authDto: PassAuthRequest,
  ): Promise<AuthResponse> {
    return this.authService.signIn(authDto);
  }

  @Post('/signup')
  @ApiResponse({ status: 200, type: AuthResponse })
  signUp(
    @Body(ValidationPipe) authDto: SignUpRequest,
  ): Promise<AuthResponse> {
    return this.authService.signUp(authDto);
  }
}
