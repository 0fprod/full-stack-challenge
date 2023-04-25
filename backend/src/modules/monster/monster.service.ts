import { Injectable } from '@nestjs/common';
import { Monster } from './entity/monster.entity';
import { MonsterRepository } from './monster.repository';

@Injectable()
export class MonsterService {
  constructor(private repository: MonsterRepository) {}

  findOne(id: string): Promise<Monster> {
    return this.repository.findOne(id);
  }

  findAll(skip?: number, limit?: number): Promise<Monster[]> {
    return this.repository.findAll(skip, limit);
  }

  create(monster: Monster): Promise<Monster> {
    return this.repository.create(monster);
  }

  async update(partialMonster: Partial<Monster>): Promise<Monster> {
    const id = partialMonster.id;
    const currentMonster = await this.findOne(id);

    if (currentMonster === null) {
      return null;
    }

    const updatedMonster = this.updateMonsterAttribuesWithPartialMonster(currentMonster, partialMonster);
    return this.repository.update(updatedMonster);
  }

  remove(id: string): Promise<Monster> {
    return this.repository.remove(id);
  }

  increaseGold(monster: Monster): Promise<Monster> {
    monster.goldBalance += 10;
    return this.update(monster);
  }

  decreaseGold(monster: Monster): Promise<Monster> {
    monster.goldBalance -= 10;
    return this.update(monster);
  }

  private updateMonsterAttribuesWithPartialMonster(
    monsterToUpdate: Monster,
    partialMonster: Partial<Monster>,
  ): Monster {
    function overrideTargetWithSourcePropertiesRecursively(target: any, source: any): any {
      const mergedObject = { ...target };

      Object.entries(source).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          mergedObject[key] = overrideTargetWithSourcePropertiesRecursively(target[key], value);
        } else {
          mergedObject[key] = value;
        }
      });

      return mergedObject;
    }

    const mergedMonster = overrideTargetWithSourcePropertiesRecursively(monsterToUpdate, partialMonster);
    return mergedMonster;
  }
}
