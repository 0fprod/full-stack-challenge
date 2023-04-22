import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../common/decoratos/auth.decorator';
import { AuthUserDto } from './dto/AuthUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() authUserDto: AuthUserDto) {
    return this.authService.logIn(authUserDto.username, authUserDto.password);
  }
}
