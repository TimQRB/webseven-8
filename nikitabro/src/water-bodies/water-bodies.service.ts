import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client.js';
import { CreateWaterBodyDto, UpdateWaterBodyDto } from './dto/water-body.dto';
import { CreateMeasurementDto } from './dto/measurement.dto';

@Injectable()
export class WaterBodiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.waterBody.findMany({
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async findOne(id: string) {
    const waterBody = await this.prisma.waterBody.findUnique({
      where: { id },
      include: {
        passport: true,
        measurements: {
          orderBy: { recordDate: 'desc' },
        },
      },
    });

    if (!waterBody) {
      throw new NotFoundException(`Водоем с ID ${id} не найден`);
    }

    return waterBody;
  }

  async create(data: CreateWaterBodyDto) {
    const { passport, ...waterBodyData } = data;

    return this.prisma.waterBody.create({
      data: {
        ...waterBodyData,
        boundaries:
          waterBodyData.boundaries === undefined
            ? undefined
            : (waterBodyData.boundaries as Prisma.InputJsonValue),
        passport: passport ? { create: passport } : undefined,
      },
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async update(id: string, data: UpdateWaterBodyDto) {
    const { passport, ...waterBodyData } = data;

    return this.prisma.waterBody.update({
      where: { id },
      data: {
        ...waterBodyData,
        boundaries:
          waterBodyData.boundaries === undefined
            ? undefined
            : (waterBodyData.boundaries as Prisma.InputJsonValue),
        passport: passport
          ? {
              upsert: {
                create: passport,
                update: passport,
              },
            }
          : undefined,
      },
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.waterBody.delete({
      where: { id },
    });
  }

  async addMeasurement(waterBodyId: string, data: CreateMeasurementDto) {
    const waterBody = await this.prisma.waterBody.findUnique({
      where: { id: waterBodyId },
    });

    if (!waterBody) {
      throw new NotFoundException(`Водоем с ID ${waterBodyId} не найден`);
    }

    const payload = this.mapMeasurementDtoToUncheckedCreate(data);

    return this.prisma.bioindicationRecord.create({
      data: {
        ...payload,
        waterBodyId,
      },
    });
  }

  async getMeasurements(waterBodyId: string) {
    return this.prisma.bioindicationRecord.findMany({
      where: { waterBodyId },
      orderBy: { recordDate: 'desc' },
    });
  }

  async updateMeasurement(
    waterBodyId: string,
    measurementId: string,
    data: CreateMeasurementDto,
  ) {
    const measurement = await this.prisma.bioindicationRecord.findFirst({
      where: { id: measurementId, waterBodyId },
    });

    if (!measurement) {
      throw new NotFoundException(`Замер с ID ${measurementId} не найден`);
    }

    const payload = this.mapMeasurementDtoToUpdate(data);

    return this.prisma.bioindicationRecord.update({
      where: { id: measurementId },
      data: payload,
    });
  }

  async removeMeasurement(waterBodyId: string, measurementId: string) {
    const measurement = await this.prisma.bioindicationRecord.findFirst({
      where: { id: measurementId, waterBodyId },
    });

    if (!measurement) {
      throw new NotFoundException(`Замер с ID ${measurementId} не найден`);
    }

    return this.prisma.bioindicationRecord.delete({
      where: { id: measurementId },
    });
  }

  private mapMeasurementDtoToUncheckedCreate(
    dto: CreateMeasurementDto,
  ): Omit<Prisma.BioindicationRecordUncheckedCreateInput, 'waterBodyId'> {
    const { ph: _ph, hydrocarbonates, recordDate, ...rest } = dto;

    return {
      ...rest,
      ...(hydrocarbonates !== undefined ? { hydrocarbons: hydrocarbonates } : {}),
      ...(recordDate !== undefined ? { recordDate: new Date(recordDate) } : {}),
    };
  }

  private mapMeasurementDtoToUpdate(
    dto: CreateMeasurementDto,
  ): Prisma.BioindicationRecordUpdateInput {
    const base = this.mapMeasurementDtoToUncheckedCreate(dto);
    const entries = Object.entries(base).filter(
      ([, v]) => v !== undefined,
    ) as [string, unknown][];
    return Object.fromEntries(entries) as Prisma.BioindicationRecordUpdateInput;
  }
}
