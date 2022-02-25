import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.entity';
import { AuthResponse } from './dto/auth.dto';
import { PassAuthRequest } from './dto/pass-auth.dto';
import { SignUpRequest } from './dto/sign-up.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService,
  ) { }

  async signIn({ email, password }: PassAuthRequest): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Пользователь не найден');
    if (!user.checkPassword(password)) throw new UnauthorizedException('Не верный логин или пароль');
    const payload: JwtPayload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }
  async signUp({ userId, email, password }: SignUpRequest): Promise<AuthResponse> {
    const existingUser = await this.userModel.findOne({ where: { id: userId, email } });
    if (existingUser.password != null) throw new UnauthorizedException('Пользователь уже существует');
    existingUser.update({ password, registeredAt: new Date() });
    const payload: JwtPayload = { id: existingUser.id, email: existingUser.email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: existingUser };
  }
}
