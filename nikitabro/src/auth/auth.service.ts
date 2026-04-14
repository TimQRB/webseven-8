import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingByLogin = await this.usersService.findByLogin(data.login);
    if (existingByLogin) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const existingByEmail = await this.usersService.findByEmail(data.email);
    if (existingByEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.create({
      login: data.login,
      email: data.email,
      password: hashedPassword,
      avatarUrl: data.avatarUrl,
      role: data.role ?? 'CLIENT',
    });

    const { password, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(
      user.id,
      user.login,
      user.email,
      user.role,
    );

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const { password, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(
      user.id,
      user.login,
      user.email,
      user.role,
    );

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Доступ запрещён');
    }

    return this.generateTokens(
      user.id,
      user.login,
      user.email,
      user.role,
    );
  }

  private async generateTokens(
    userId: string,
    login: string,
    email: string,
    role: string,
  ) {
    const payload = {
      sub: userId,
      login,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
