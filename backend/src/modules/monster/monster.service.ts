import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonsterEntity } from './entity/monster.entity';
import { Monster, MonsterDocument } from './schema/monster.schema';

@Injectable()
export class MonsterService {
  constructor(@InjectModel(MonsterEntity.name) private monsterModel: Model<MonsterEntity>) {}

  async create(createMonsterDto: MonsterEntity): Promise<MonsterEntity> {
    const createdMonster: MonsterDocument = await new this.monsterModel(createMonsterDto).save();
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
      throw new Error('Monster not found');
    }

    const updatedMonster = this.merge(this.mapMonsterDocumentToMonsterEntity(currentMonster), monster);
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

  private merge(monster: MonsterEntity, updateMonsterDto: Partial<MonsterEntity>): MonsterEntity {
    function mergeObjects(obj1: any, obj2: any): any {
      const mergedObj = { ...obj1 };

      Object.entries(obj2).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          mergedObj[key] = mergeObjects(obj1[key], value);
        } else {
          mergedObj[key] = value;
        }
      });

      return mergedObj;
    }
    function replacer(key, value) {
      // Filtering out properties
      if (value === null) {
        return undefined;
      }
      return value;
    }

    const mergedMonster = mergeObjects(monster, updateMonsterDto);
    return JSON.parse(JSON.stringify(mergedMonster, replacer));
  }
}
