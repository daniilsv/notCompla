import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { Auth } from 'src/auth/role.decorator';
import { User } from 'src/models/user.entity';
import { FcmTokenRequest } from './dto/fcm-token.dto';
import { UserService } from './user.service';

@Auth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('/me')
  @ApiResponse({ status: 200, type: User })
  getMe(@GetUser(ValidationPipe) user: User): Promise<User> {
    return this.userService.getMe(user);
  }

  @Post('/edit/me')
  @ApiResponse({ status: 200, type: User })
  editMe(@GetUser(ValidationPipe) user: User,
    @Body() dto: User,
  ): Promise<User> {
    return this.userService.editMe(user, dto);
  }

  @Post('/addFcmToken')
  @ApiResponse({ status: 200, type: Boolean })
  addFcmToken(
    @GetUser(ValidationPipe) user: User,
    @Body(ValidationPipe) dto: FcmTokenRequest,
  ): Promise<boolean> {
    return this.userService.addFcmToken(user, dto);
  }

  @Post('/logout')
  @ApiResponse({ status: 200, type: Boolean })
  logout(@Body(ValidationPipe) dto: FcmTokenRequest): Promise<boolean> {
    return this.userService.logout(dto);
  }
}
