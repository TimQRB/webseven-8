import { Module } from '@nestjs/common';
import { WaterBodiesService } from './water-bodies.service';
import { WaterBodiesController } from './water-bodies.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [WaterBodiesService],
  controllers: [WaterBodiesController],
})
export class WaterBodiesModule {}
