import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ObjectId } from 'mongoose';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  create(@Body() dto: CreateUserDto, picture?: Express.Multer.File) {
    return this.userService.create(dto, picture);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.userService.delete(id);
  }
}
