import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FileService, FileType } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async create(
    createUserDto: CreateUserDto,
    picture?: Express.Multer.File,
  ): Promise<User> {
    if (picture)
      createUserDto.picture = this.fileService.createFile(
        FileType.IMAGE,
        picture,
      );

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    return this.userModel.create({
      ...createUserDto,
      password: hash,
    });
  }

  async delete(id: ObjectId): Promise<User> {
    try {
      const user = await this.userModel.findById(id);
      if (user.picture) this.fileService.removeFile(user.picture);

      user.remove();

      return user;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
