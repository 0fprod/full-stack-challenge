import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonsterEntity } from './entity/monster.entity';
import { MonsterDocument } from './schema/monster.schema';

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

  async update(id: string, monster: MonsterEntity): Promise<MonsterEntity> {
    await this.monsterModel.updateOne({ _id: id }, monster).exec();
    return this.findOne(id);
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
}
