import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class PassportDto {
  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsNumber()
  overgrowthArea?: number;

  @IsOptional()
  @IsNumber()
  altitude?: number;

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  maxWidth?: number;

  @IsOptional()
  @IsNumber()
  coastlineLength?: number;

  @IsOptional()
  @IsNumber()
  coastlineDev?: number;

  @IsOptional()
  @IsNumber()
  catchmentArea?: number;

  @IsOptional()
  @IsNumber()
  currentDepth?: number;

  @IsOptional()
  @IsNumber()
  maxDepth?: number;

  @IsOptional()
  @IsNumber()
  avgDepth?: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  fisheryType?: string;

  @IsOptional()
  @IsNumber()
  fishProductivity?: number;

  @IsOptional()
  @IsString()
  economicDesc?: string;

  @IsOptional()
  @IsString()
  waterProtectionZone?: string;

  @IsOptional()
  @IsString()
  waterProtectionStrip?: string;

  @IsOptional()
  @IsString()
  ichthyofauna?: string;

  @IsOptional()
  @IsString()
  mammals?: string;

  @IsOptional()
  @IsString()
  invertebrates?: string;
}

export class CreateWaterBodyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  locationDesc?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsObject()
  boundaries?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  cadastralNumber?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PassportDto)
  passport?: PassportDto;
}

export class UpdateWaterBodyDto extends PartialType(CreateWaterBodyDto) {}
