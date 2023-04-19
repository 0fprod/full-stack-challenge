import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async logIn(name: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(name);

    // TODO: encrypt the password: bcrypt
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.name, role: user.role, sub: user.name };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('TOKEN_EXPIRES_IN'),
      }),
    };
  }
}
