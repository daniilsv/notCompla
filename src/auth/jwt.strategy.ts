import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../models/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
    });
  }

  async validate({ id }: JwtPayload): Promise<User> {
    // Logger.log('validate');
    //TODO: add cache
    const user = await this.userModel.findByPk(id);
    // Logger.log(user);
    return user;
  }
}
@Injectable()
export class OptionalStrategy extends PassportStrategy(Strategy, 'optional') {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('jwt.secret'),
    });
  }
  authenticate(req) {
    // Logger.log('authenticate');
    return this.success({})
  }
  async validate({ id }: JwtPayload): Promise<User> {
    // Logger.log('validate');
    //TODO: add cache
    const user = await this.userModel.findByPk(id);
    // Logger.log(user);
    return user;
  }
}
