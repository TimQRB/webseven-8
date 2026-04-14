import { Test, TestingModule } from '@nestjs/testing';
import { WaterBodiesService } from './water-bodies.service';

describe('WaterBodiesService', () => {
  let service: WaterBodiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaterBodiesService],
    }).compile();

    service = module.get<WaterBodiesService>(WaterBodiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
