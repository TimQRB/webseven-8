import { IsNumber, IsOptional, IsDateString, IsString } from 'class-validator';

export class CreateMeasurementDto {
  @IsOptional()
  @IsDateString()
  recordDate?: string;

  // Химические показатели
  @IsOptional()
  @IsNumber()
  ph?: number;

  @IsOptional()
  @IsNumber()
  turbidity?: number;

  @IsOptional()
  @IsString()
  dissolvedGases?: string;

  @IsOptional()
  @IsString()
  biogenicCompounds?: string;

  @IsOptional()
  @IsNumber()
  permanganateOxid?: number;

  // Ионный состав и минерализация воды
  @IsOptional()
  @IsNumber()
  mineralization?: number;

  @IsOptional()
  @IsNumber()
  salinity?: number;

  @IsOptional()
  @IsNumber()
  hardness?: number;

  @IsOptional()
  @IsNumber()
  calcium?: number;

  @IsOptional()
  @IsNumber()
  magnesium?: number;

  @IsOptional()
  @IsNumber()
  chlorides?: number;

  @IsOptional()
  @IsNumber()
  sulfates?: number;

  @IsOptional()
  @IsNumber()
  hydrocarbonates?: number;

  @IsOptional()
  @IsNumber()
  potassiumSodium?: number;

  // Характер и степень зарастания
  @IsOptional()
  @IsNumber()
  overgrowthPercent?: number;

  @IsOptional()
  @IsString()
  overgrowthDegree?: string;

  // Биология и планктон
  @IsOptional()
  @IsString()
  phytoplanktonDev?: string;

  @IsOptional()
  @IsString()
  zooplanktonTaxa?: string;

  @IsOptional()
  @IsString()
  zooplanktonGroups?: string;

  @IsOptional()
  @IsString()
  zoobenthosTaxa?: string;

  @IsOptional()
  @IsString()
  zoobenthosGroups?: string;

  @IsOptional()
  @IsString()
  trophicStatus?: string;
}
