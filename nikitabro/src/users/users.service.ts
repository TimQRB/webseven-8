import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Array<Pick<User, 'id' | 'login' | 'email' | 'avatarUrl' | 'role'>>> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
      orderBy: {
        login: 'asc',
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput | CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        login: data.login,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl,
        role: data.role ?? 'CLIENT',
      },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.login !== undefined && { login: data.login }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
        ...(data.role !== undefined && { role: data.role }),
      },
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
