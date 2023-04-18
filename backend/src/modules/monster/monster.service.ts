import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monster } from '../../database/schemas/monster.schema';

@Injectable()
export class MonsterService {
  constructor(@InjectModel(Monster.name) private monsterModel: Model<Monster>) {}

  async create(monster: Monster): Promise<Monster> {
    const createdMonster = await this.monsterModel.create(monster);
    return createdMonster;
  }

  async findAll(): Promise<Monster[]> {
    return await this.monsterModel.find().exec();
  }
}
