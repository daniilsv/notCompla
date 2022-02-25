import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/models/user.entity';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Auth(UserRole.admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('createDesigner')
  @ApiResponse({ status: 200, type: User })
  create(@Body(ValidationPipe) user: User) {
    return this.adminService.createDesigner(user);
  }

  @Post('blockDesigner/:id')
  block(@Param('id') userId: string) {
    return this.adminService.blockDesigner(userId);
  }

  @Post('unblockDesigner/:id')
  unblock(@Param('id') userId: string) {
    return this.adminService.unblockDesigner(userId);
  }

  @ApiResponse({ status: 200, type: User })
  @Put('editDesigner/:id')
  edit(@Param('id') userId: string, @Body() user: User) {
    return this.adminService.editDesigner(userId, user);
  }

  @ApiResponse({ status: 200, type: [User] })
  @Get('designers')
  designers() {
    return this.adminService.designers();
  }
}
