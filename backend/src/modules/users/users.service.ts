import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      name: 'john',
      role: 'admin',
      password: 'john',
    },
    {
      name: 'chris',
      role: 'user',
      password: 'chris',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
