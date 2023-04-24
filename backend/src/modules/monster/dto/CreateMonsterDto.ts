import { IsString, IsNumber, Min, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMonsterDto {
  @ApiProperty({ example: 'Mr', description: 'Monsters title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Wise', description: 'Monsters name' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dragon', description: 'Monsters last name', required: false })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'male', description: 'Male/Female/Other', required: false })
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({
    example: ['ES'],
    description: 'Monsters nationality, can have multiple but always as ISO format',
    required: false,
  })
  @IsString({ each: true })
  @MaxLength(2, {
    each: true,
  })
  nationality: string[];

  @ApiProperty({ example: 'A very funny dragon', description: 'Monsters description', required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'https://some.url', description: 'Monsters image url', required: false })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 100, description: 'Monsters speed', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  speed: number;

  @ApiProperty({ example: 100, description: 'Monsters heatlh', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  health: number;

  @ApiProperty({ example: 'can breath under water', description: 'Monsters special fact', required: false })
  @IsOptional()
  @IsString()
  secretNotes: string;

  @ApiProperty({ example: '1234', description: 'Monsters password', required: false })
  @IsOptional()
  @IsString()
  monsterPassword: string;
}
