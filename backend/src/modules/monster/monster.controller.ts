import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { Monster } from '../../database/schemas/monster.schema';
import { Roles } from '../common/decoratos/roles.decorator';
import { Role } from '../common/decoratos/role.enum';
import { Public } from '../common/decoratos/auth.decorator';

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

  @Roles(Role.Admin)
  @Delete()
  delete(@Body() monsterId: string): Promise<Monster> {
    return this.monsterService.remove(monsterId);
  }

  @Roles(Role.Admin)
  @Put()
  update(@Body() monster: Monster, @Query() monsterId: string): Promise<Monster> {
    return this.monsterService.update(monsterId, monster);
  }
}
