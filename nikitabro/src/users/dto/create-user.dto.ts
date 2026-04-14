import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @MinLength(3, { message: 'Логин должен содержать минимум 3 символа' })
  login: string;

  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @IsOptional()
  @IsString({ message: 'avatarUrl должен быть строкой' })
  avatarUrl?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'CLIENT'], {
    message: 'Роль может быть только ADMIN или CLIENT',
  })
  role?: 'ADMIN' | 'CLIENT';
}
