import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseFilters,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { YelnurException } from '../common/exceptions/yelnur.exception';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Query, Redirect } from '@nestjs/common/decorators';
import { Observable, of, map } from 'rxjs';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    throw new ForbiddenException();
  }

  @Post('postus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async postus(@Body() createCatDto: CreateCatDto) {
    return { ...createCatDto, date: Date.now() };
  }

  @Get('findAll')
  findAll() {
    return this.catsService.findAll();
  }

  @Get('excep')
  async checkExcept() {
    try {
      return await this.catsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          message: 'This is a custom message',
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Get('yelnurexception')
  async checkYelnur() {
    throw new YelnurException();
  }

   @Get("docs")
  @Redirect("https://youtube.com")
  redirectToyoutube(@Query("version") version: string) {
    if (version === "5") {
      return {
        url: "https://www.youtube.com/watch?v=zWH_9VRWn8Y"
      }
    }
  }

  @Get('promises')
async promis(): Promise<any[]> {
  const data = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m")
  const res = data.json()
  return res
}


  @Get("breed")
  findBreed(): string {
    return "this is breed";
  }

  @Get("observ")
getData(): Observable<any> {
  return of({ message: 'Hello' }).pipe(
    map(v => ({ ...v, date: Date.now() })),
    map(v => ({ ...v, server: "server" })),
    map(v => ({ ...v, help: "help" }))
  );
}


  @Get("test")
  findReq(@Headers() headers: string) {
    return {
      message: "rewrfsdsfaesdffasfddfbge",
      headers: headers
    }
  }

  @Get("concrete")
  findConcreteComponentFromHeaders(@Headers("host") host: string, @Headers("connection") connection: string) {
    return {
      message: "rewrfsdsfaesdffasfddfbge",
      host: host,
      connection: connection
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }
}
