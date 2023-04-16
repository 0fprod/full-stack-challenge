import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';
import { RoleGuard } from './role.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() userDto: Record<string, any>) {
    return this.authService.logIn(userDto.username, userDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get('authorized')
  @Roles(Role.User)
  authorized(@Request() req) {
    return req.user;
  }
}
