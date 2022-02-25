import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from 'src/models/project.entity';
import { UserFcm } from 'src/models/user-fcm.entity';
import { User } from '../models/user.entity';
import { FcmTokenRequest } from './dto/fcm-token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserFcm)
    private userFcmModel: typeof UserFcm,
    private jwtService: JwtService,
  ) { }

  async getMe(user: User): Promise<User> {
    return this.userModel.scope('withProjects').findByPk(user.id);
  }

  async editMe(oldUser: User, newUser: User): Promise<User> {
    let res = await this.userModel.findByPk(oldUser.id);
    if (!res) throw new NotFoundException('Пользователь не найден');
    try {
      res = await res.update(newUser.toJSON());
      return res;
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Не удалось отредактировать пользователя');
    }
  }

  async addFcmToken(user: User, { fcmToken, role }: FcmTokenRequest,): Promise<boolean> {
    if (!fcmToken) return;
    await this.userFcmModel.destroy({ where: { token: fcmToken } });
    await this.userFcmModel.create({
      userId: user.id,
      token: fcmToken,
      role,
    });
    return true;
  }

  async logout({ fcmToken }: FcmTokenRequest): Promise<boolean> {
    if (!fcmToken) return;
    try {
      await this.userFcmModel.destroy({ where: { token: fcmToken } });
    } catch (e) { }
    return true;
  }
}
