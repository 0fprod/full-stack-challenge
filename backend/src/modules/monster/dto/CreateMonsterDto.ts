import { IsString, IsNumber, Min, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMonsterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  gender: string;

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
  goldBalance: number;

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
