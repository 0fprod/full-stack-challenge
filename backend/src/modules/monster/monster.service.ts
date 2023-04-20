import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonsterEntity } from './entity/monster.entity';
import { MonsterDocument } from './schema/monster.schema';

@Injectable()
export class MonsterService {
  constructor(@InjectModel(MonsterEntity.name) private monsterModel: Model<MonsterEntity>) {}

  async create(monster: MonsterEntity): Promise<MonsterEntity> {
    const createdMonster: MonsterDocument = await new this.monsterModel(monster).save();
    return this.mapMonsterDocumentToMonsterEntity(createdMonster);
  }

  async findAll(): Promise<MonsterEntity[]> {
    return await this.monsterModel.find().exec();
  }

  async findOne(id: string): Promise<MonsterEntity> {
    return await this.monsterModel.findById(id).exec();
  }

  async update(monster: Partial<MonsterEntity>): Promise<MonsterEntity> {
    const id = monster.id;
    const currentMonster: MonsterDocument = await this.monsterModel.findById(id).exec();

    if (currentMonster === null) {
      return null;
    }

    const updatedMonster = this.updateMonsterAttribuesWithPartialMonster(
      this.mapMonsterDocumentToMonsterEntity(currentMonster),
      monster,
    );
    const result: MonsterDocument = await this.monsterModel
      .findOneAndUpdate({ _id: id }, updatedMonster, { new: true })
      .exec();

    return this.mapMonsterDocumentToMonsterEntity(result);
  }

  async remove(id: string): Promise<MonsterEntity> {
    return await this.monsterModel.findByIdAndRemove(id);
  }

  private mapMonsterDocumentToMonsterEntity(monster: MonsterDocument): MonsterEntity {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = monster.toObject<any>();
    return {
      id: _id.toString(),
      ...rest,
    };
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
