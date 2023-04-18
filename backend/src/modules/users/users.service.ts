import { Injectable } from '@nestjs/common';
import { User } from '../../database/schemas/user.shema';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      name: 'Bored Mike',
      role: 'admin',
      password: 'mike',
    },
    {
      name: 'Everyone',
      role: 'user',
      password: 'public',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
