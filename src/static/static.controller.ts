import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/role.decorator';
import { Static } from 'src/models/static.entity';
import { StaticService } from './static.service';

@ApiTags('static')
@Auth()
@Controller('static')
export class StaticController {
  constructor(private staticService: StaticService) { }

  @Get('/get')
  @ApiResponse({ status: 200, type: [Static] })
  get(): Promise<Static[]> {
    return this.staticService.get();
  }
}
