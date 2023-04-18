import { Body, Controller, Get, Post } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { Monster } from 'src/database/schemas/monster.schema';
import { Roles } from '../common/decoratos/roles.decorator';
import { Role } from '../common/decoratos/role.enum';

@Controller('monster')
export class MonsterController {
  constructor(private monsterService: MonsterService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(): Promise<Monster[]> {
    return this.monsterService.findAll();
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() monster: Monster): Promise<Monster> {
    return this.monsterService.create(monster);
  }
}
