import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { UserEntity } from './entity/user.entity';

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

  async findOne(name: string): Promise<UserEntity> {
    const user = this.users.find((user) => user.name === name);
    if (!user) return null;

    return this.mapUserToEntity(user);
  }

  private mapUserToEntity(user: User): UserEntity {
    return {
      name: user.name,
      password: user.password,
      role: user.role,
    };
  }
}
