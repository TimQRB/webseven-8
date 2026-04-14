import { IsString, IsInt, Min, Max } from "class-validator";

export class CreateCatDto {

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(30)
  age: number;

  @IsString()
  breed: string
}
