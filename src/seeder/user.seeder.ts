import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const users = DataFactory.createForClass(User).generate(2, {
      created_by: 'Seeder',
    });

    return this.userModel.insertMany(users);
  }

  async drop(): Promise<any> {
    return this.userModel.deleteMany({ created_by: 'Seeder' });
  }
}
