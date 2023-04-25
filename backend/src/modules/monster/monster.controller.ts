import { Body, Controller, Delete, Get, NotFoundException, Patch, Post, Query } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { Monster } from './entity/monster.entity';
import { Roles } from '../../common/decoratos/roles.decorator';
import { Role } from '../../common/decoratos/role.enum';
import { CreateMonsterDto, UpdateMonsterDTO } from './dto';
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('monster')
@Controller('monster')
export class MonsterController {
  constructor(private monsterService: MonsterService) {}

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Find all monsters (authenticated)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: Monster,
    description: 'Monsters found',
  })
  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(@Query('skip') skip?: number, @Query('limit') limit?: number): Promise<Monster[]> {
    return this.monsterService.findAll(skip, limit);
  }

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Creates a monster' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 201,
    type: Monster,
    description: 'Created monster',
  })
  @Roles(Role.Admin)
  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto): Promise<Monster> {
    const monster = Monster.fromCreateMonsterDTO(createMonsterDto);

    return this.monsterService.create(monster);
  }

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Updates a monster' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    type: Monster,
    description: 'Updated monster',
  })
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

  @ApiBearerAuth('swaggerBearerAuth')
  @ApiOperation({ summary: 'Deletes a monster' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Monster not found.' })
  @ApiResponse({
    status: 200,
    type: Monster,
    description: 'Removed monster',
  })
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
