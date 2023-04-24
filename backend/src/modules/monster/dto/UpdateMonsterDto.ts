import { IsString, IsNumber, Min, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateMonsterDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString({ each: true })
  @MaxLength(2, {
    each: true,
  })
  nationality: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  speed: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  health: number;

  @IsOptional()
  @IsString()
  secretNotes: string;

  @IsOptional()
  @IsString()
  monsterPassword: string;
}
