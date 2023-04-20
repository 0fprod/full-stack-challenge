import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { MonsterEntity } from './entity/monster.entity';
import { Roles } from '../common/decoratos/roles.decorator';
import { Role } from '../common/decoratos/role.enum';
import { CreateMonsterDto, UpdateMonsterDTO } from './dto';

@Controller('monster')
export class MonsterController {
  constructor(private monsterService: MonsterService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(): Promise<MonsterEntity[]> {
    return this.monsterService.findAll();
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto): Promise<MonsterEntity> {
    const monster = MonsterEntity.fromCreateMonsterDTO(createMonsterDto);
    return this.monsterService.create(monster);
  }

  @Roles(Role.Admin)
  @Patch()
  update(@Body() updateMonsterDto: UpdateMonsterDTO): Promise<MonsterEntity> {
    const monster = MonsterEntity.fromUpdateMonsterDTO(updateMonsterDto);

    return this.monsterService.update(monster);
  }

  @Roles(Role.Admin)
  @Delete()
  delete(@Body() monsterId: string): Promise<MonsterEntity> {
    return this.monsterService.remove(monsterId);
  }
}
