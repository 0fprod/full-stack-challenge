import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({ example: 'bored_mike', description: 'The user name' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'mike', description: "The user's password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
