import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }

  findOne(id: number): Cat {
    const needed = this.cats.find((cat) => cat.age === id);
    if (!needed) {
      throw new NotFoundException("Can't found");
    }
    return needed;
  }
}
