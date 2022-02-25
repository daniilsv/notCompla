import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Static } from 'src/models/static.entity';

@Injectable()
export class StaticService {
  constructor(
    @InjectModel(Static)
    private staticModel: typeof Static,
  ) { }

  async get(): Promise<Static[]> {
    return this.staticModel.findAll();
  }

}
