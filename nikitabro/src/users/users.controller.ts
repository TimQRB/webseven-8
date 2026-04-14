import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const existing = await this.usersService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    const updated = await this.usersService.update(id, body);
    return {
      id: updated.id,
      login: updated.login,
      email: updated.email,
      avatarUrl: updated.avatarUrl,
      role: updated.role,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const existing = await this.usersService.findById(id);
    if (!existing) {
      throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }

    await this.usersService.remove(id);
    return {
      message: 'Пользователь удалён',
    };
  }
}
