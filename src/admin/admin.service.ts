import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from 'src/models/user.entity';
import { PushService } from 'src/push/push.service';

@Injectable()
export class AdminService {
  constructor(private pushService: PushService) { }

  async createDesigner(user: User): Promise<User> {
    try {
      const _user = await User.create({ ...user.toJSON(), isAdmin: false });
      await this.pushService.sendMail(_user.email, 'Добро пожаловать', { id: 147507, variables: { link: `some.ru/#/registration?uuid=${_user.id}` } });
      return _user;
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  async editDesigner(userId: string, user: User) {
    let exitingUser = await User.findByPk(userId);
    if (!exitingUser) throw new NotFoundException('Пользователь не найден');
    try {
      return exitingUser.update(user.toJSON());
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Не удалось отредактировать пользователя');
    }
  }

  designers() {
    return User.findAll({ paranoid: false });
  }

  async blockDesigner(userId: string) {
    const user = await User.findByPk(userId);
    await user.destroy();
    return true;
  }

  async unblockDesigner(userId: string) {
    const user = await User.findByPk(userId, { paranoid: false });
    await user.restore();
    return true;
  }
}
