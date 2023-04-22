import { Injectable } from '@nestjs/common';
import { MonsterEntity } from './entity/monster.entity';
import { MonsterRepository } from './monster.repository';

@Injectable()
export class MonsterService {
  constructor(private repository: MonsterRepository) {}

  findOne(id: string): Promise<MonsterEntity> {
    return this.repository.findOne(id);
  }

  findAll(skip?: number, limit?: number): Promise<MonsterEntity[]> {
    return this.repository.findAll(skip, limit);
  }

  create(monster: MonsterEntity): Promise<MonsterEntity> {
    return this.repository.create(monster);
  }

  async update(partialMonster: Partial<MonsterEntity>): Promise<MonsterEntity> {
    const id = partialMonster.id;
    const currentMonster = await this.findOne(id);

    if (currentMonster === null) {
      return null;
    }

    const updatedMonster = this.updateMonsterAttribuesWithPartialMonster(currentMonster, partialMonster);
    return this.repository.update(updatedMonster);
  }

  remove(id: string): Promise<MonsterEntity> {
    return this.repository.remove(id);
  }

  private updateMonsterAttribuesWithPartialMonster(
    monsterToUpdate: MonsterEntity,
    partialMonster: Partial<MonsterEntity>,
  ): MonsterEntity {
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
