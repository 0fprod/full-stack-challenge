import { Injectable } from '@nestjs/common';
import { User } from 'src/database/users/user.entity';

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      name: 'john',
      role: 'admin',
    },
    {
      name: 'chris',
      role: 'user',
    },
  ];

  async findOne(name: string): Promise<User | undefined> {
    return this.users.find((user) => user.name === name);
  }
}
