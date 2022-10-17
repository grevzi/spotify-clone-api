import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { ObjectId } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  create(@Body() dto: CreateUserDto, picture?: Express.Multer.File) {
    return this.userService.create(dto, picture);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @Param('id') id: ObjectId,
    @Body() dto: UpdateUserDto,
    @UploadedFile() picture?: Express.Multer.File,
  ) {
    return this.userService.update(id, dto, picture);
  }

  @Get()
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
  ) {
    return this.userService.getAll(limit, offset, query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.userService.getOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: ObjectId) {
    return this.userService.delete(id);
  }
}
