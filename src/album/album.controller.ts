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
  UseInterceptors,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AlbumService } from './album.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';

@Controller('/api/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  create(
    @Body() dto: CreateAlbumDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return this.albumService.create(dto, picture);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('picture'))
  update(
    @Param('id') id: ObjectId,
    @Body() createTrackDto: CreateAlbumDto,
    @UploadedFile() picture?: Express.Multer.File,
  ) {
    return this.albumService.update(id, createTrackDto, picture);
  }

  @Get()
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
  ) {
    return this.albumService.getAll(limit, offset, query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.albumService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.albumService.delete(id);
  }
}
