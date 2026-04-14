import { Test, TestingModule } from '@nestjs/testing';
import { WaterBodiesController } from './water-bodies.controller';

describe('WaterBodiesController', () => {
  let controller: WaterBodiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaterBodiesController],
    }).compile();

    controller = module.get<WaterBodiesController>(WaterBodiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
