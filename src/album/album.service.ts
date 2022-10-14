import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album, AlbumDocument } from './schemas/album.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { FileService, FileType } from '../file/file.service';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(
    createAlbumDto: CreateAlbumDto,
    picture: Express.Multer.File,
  ): Promise<Album> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);

    return this.albumModel.create({
      ...createAlbumDto,
      picture: picturePath,
    });
  }

  async update(
    id: ObjectId,
    updateAlbumDto: UpdateAlbumDto,
    picture?: Express.Multer.File,
  ): Promise<Album> {
    if (picture) {
      const album = await this.albumModel.findById(id);
      if (album.picture) this.fileService.removeFile(album.picture);

      updateAlbumDto.picture = this.fileService.createFile(
        FileType.IMAGE,
        picture,
      );
    }

    return this.albumModel.findByIdAndUpdate(id, {
      ...updateAlbumDto,
    });
  }

  async getAll(limit = 10, offset = 0, query = ''): Promise<Album[]> {
    const filter = {
      name: { $regex: new RegExp(query, 'i') },
    };
    return this.albumModel
      .find(filter)
      .populate({
        path: 'tracks',
        populate: {
          path: 'comments',
        },
      })
      .skip(offset)
      .limit(limit);
  }

  async getOne(id: ObjectId): Promise<Album> {
    return this.albumModel.findById(id).populate({
      path: 'tracks',
      populate: {
        path: 'comments',
      },
    });
  }

  async delete(id: ObjectId): Promise<Album> {
    try {
      const album = await this.albumModel.findById(id);
      if (album.picture) this.fileService.removeFile(album.picture);

      album.remove();

      return album;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
