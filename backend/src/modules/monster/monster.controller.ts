import { Body, Controller, Delete, Get, NotFoundException, Patch, Post, Query } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { Monster } from './entity/monster.entity';
import { Roles } from '../../common/decoratos/roles.decorator';
import { Role } from '../../common/decoratos/role.enum';
import { CreateMonsterDto, UpdateMonsterDTO } from './dto';

@Controller('monster')
export class MonsterController {
  constructor(private monsterService: MonsterService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query('skip') skip: number, @Query('limit') limit: number): Promise<Monster[]> {
    return this.monsterService.findAll(skip, limit);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto): Promise<Monster> {
    const monster = Monster.fromCreateMonsterDTO(createMonsterDto);

    return this.monsterService.create(monster);
  }

  @Roles(Role.Admin)
  @Patch()
  async update(@Body() updateMonsterDto: UpdateMonsterDTO): Promise<Monster> {
    const monster = Monster.fromUpdateMonsterDTO(updateMonsterDto);
    const updatedMonster = await this.monsterService.update(monster);

    if (updatedMonster === null) {
      throw new NotFoundException('Monster doesnt exist, review the monster id.');
    }

    return updatedMonster;
  }

  @Roles(Role.Admin)
  @Delete()
  async delete(@Query('id') monsterId: string): Promise<Monster> {
    const deletedMonster = await this.monsterService.remove(monsterId);

    if (deletedMonster === null) {
      throw new NotFoundException('Monster doesnt exist, review the monster id.');
    }

    return deletedMonster;
  }
}
