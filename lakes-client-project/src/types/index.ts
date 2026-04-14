export type UserRole = 'ADMIN' | 'CLIENT';

export interface User {
  id: string;
  login: string;
  email: string;
  avatarUrl?: string | null;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface WaterBodyPassport {
  area?: number | null;
  overgrowthArea?: number | null;
  altitude?: number | null;
  length?: number | null;
  maxWidth?: number | null;
  coastlineLength?: number | null;
  coastlineDev?: number | null;
  catchmentArea?: number | null;
  currentDepth?: number | null;
  maxDepth?: number | null;
  avgDepth?: number | null;
  volume?: number | null;
  fisheryType?: string | null;
  fishProductivity?: number | null;
  economicDesc?: string | null;
  waterProtectionZone?: string | null;
  waterProtectionStrip?: string | null;
  ichthyofauna?: string | null;
  mammals?: string | null;
  invertebrates?: string | null;
}

export interface Measurement {
  id: string;
  waterBodyId: string;
  recordDate?: string | null;
  ph?: number | null;
  turbidity?: number | null;
  dissolvedGases?: string | null;
  biogenicCompounds?: string | null;
  permanganateOxid?: number | null;
  mineralization?: number | null;
  salinity?: number | null;
  hardness?: number | null;
  calcium?: number | null;
  magnesium?: number | null;
  chlorides?: number | null;
  sulfates?: number | null;
  hydrocarbonates?: number | null;
  potassiumSodium?: number | null;
  overgrowthPercent?: number | null;
  overgrowthDegree?: string | null;
  phytoplanktonDev?: string | null;
  zooplanktonTaxa?: string | null;
  zooplanktonGroups?: string | null;
  zoobenthosTaxa?: string | null;
  zoobenthosGroups?: string | null;
  trophicStatus?: string | null;
}

export interface WaterBody {
  id: string;
  name: string;
  district?: string | null;
  locationDesc?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  boundaries?: unknown;
  cadastralNumber?: string | null;
  passport?: WaterBodyPassport | null;
  measurements?: Measurement[];
}

export type NumericMeasurementKey =
  | 'ph'
  | 'turbidity'
  | 'permanganateOxid'
  | 'mineralization'
  | 'salinity'
  | 'hardness'
  | 'calcium'
  | 'magnesium'
  | 'chlorides'
  | 'sulfates'
  | 'hydrocarbonates'
  | 'potassiumSodium'
  | 'overgrowthPercent';

export interface MetricOption {
  key: NumericMeasurementKey;
  label: string;
  unit?: string;
}
