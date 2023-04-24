import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monster } from './entity/monster.entity';
import { MonsterDocument } from './schema/monster.schema';
import { MongoRepository } from 'src/database/mongo.repository';

@Injectable()
export class MonsterRepository implements MongoRepository<Monster> {
  constructor(@InjectModel(Monster.name) private monsterModel: Model<Monster>) {}

  async create(monster: Monster): Promise<Monster> {
    const createdMonster: MonsterDocument = await new this.monsterModel(monster).save();
    return this.mapMonsterDocumentToMonsterEntity(createdMonster);
  }

  async findAll(skip?: number, limit?: number): Promise<Monster[]> {
    return await this.monsterModel.find({}, {}, { skip, limit });
  }

  async findOne(id: string): Promise<Monster> {
    const monster = await this.monsterModel.findById(id).exec();
    if (!monster) return null;
    return this.mapMonsterDocumentToMonsterEntity(monster);
  }

  async update(monster: Partial<Monster>): Promise<Monster> {
    const result: MonsterDocument = await this.monsterModel
      .findOneAndUpdate({ _id: monster.id }, monster, { new: true })
      .exec();

    return this.mapMonsterDocumentToMonsterEntity(result);
  }

  async remove(id: string): Promise<Monster> {
    return await this.monsterModel.findByIdAndRemove(id, {});
  }

  private mapMonsterDocumentToMonsterEntity(monster: MonsterDocument): Monster {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, __v, ...rest } = monster.toObject<any>();
    return {
      id: _id.toString(),
      ...rest,
    };
  }
}
