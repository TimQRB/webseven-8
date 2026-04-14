# Backend changes likely needed

Я не смог прочитать содержимое RAR-файлов побайтно в этой среде, но по именам файлов видно, что в `lakes-backend` уже есть модули:

- `auth`
- `users`
- `water-bodies`
- Prisma models `User`, `WaterBody`, `WaterBodyPassport`, `BioindicationRecord`

Именно поэтому для полной CRUD-админки обычно нужно добавить такие методы в backend.

## users.controller.ts

```ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() dto: any) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

## users.service.ts

```ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async create(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
        password: hash,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  update(id: string, dto: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        role: dto.role,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

## water-bodies.controller.ts

```ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { WaterBodiesService } from './water-bodies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('water-bodies')
@UseGuards(JwtAuthGuard)
export class WaterBodiesController {
  constructor(private readonly waterBodiesService: WaterBodiesService) {}

  @Get()
  findAll() {
    return this.waterBodiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.waterBodiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.waterBodiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.waterBodiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterBodiesService.remove(id);
  }

  @Put(':id/passport')
  upsertPassport(@Param('id') id: string, @Body() dto: any) {
    return this.waterBodiesService.upsertPassport(id, dto);
  }

  @Post(':id/measurements')
  createMeasurement(@Param('id') id: string, @Body() dto: any) {
    return this.waterBodiesService.createMeasurement(id, dto);
  }
}
```

## measurements.controller.ts (optional separate controller)

```ts
import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WaterBodiesService } from '../water-bodies/water-bodies.service';

@Controller('measurements')
@UseGuards(JwtAuthGuard)
export class MeasurementsController {
  constructor(private readonly waterBodiesService: WaterBodiesService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.waterBodiesService.updateMeasurement(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.waterBodiesService.removeMeasurement(id);
  }
}
```

## water-bodies.service.ts additions

```ts
create(dto: any) {
  return this.prisma.waterBody.create({
    data: {
      name: dto.name,
      type: dto.type,
      location: dto.location,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description,
    },
  });
}

update(id: string, dto: any) {
  return this.prisma.waterBody.update({
    where: { id },
    data: {
      name: dto.name,
      type: dto.type,
      location: dto.location,
      latitude: dto.latitude,
      longitude: dto.longitude,
      description: dto.description,
    },
  });
}

remove(id: string) {
  return this.prisma.waterBody.delete({ where: { id } });
}

upsertPassport(waterBodyId: string, dto: any) {
  return this.prisma.waterBodyPassport.upsert({
    where: { waterBodyId },
    update: dto,
    create: { ...dto, waterBodyId },
  });
}

createMeasurement(waterBodyId: string, dto: any) {
  return this.prisma.bioindicationRecord.create({
    data: {
      waterBodyId,
      ...dto,
      recordDate: new Date(dto.recordDate),
    },
  });
}

updateMeasurement(id: string, dto: any) {
  return this.prisma.bioindicationRecord.update({
    where: { id },
    data: {
      ...dto,
      recordDate: dto.recordDate ? new Date(dto.recordDate) : undefined,
    },
  });
}

removeMeasurement(id: string) {
  return this.prisma.bioindicationRecord.delete({ where: { id } });
}
```
