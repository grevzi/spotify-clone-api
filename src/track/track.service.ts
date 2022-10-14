import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Track, TrackDocument } from './schemas/track.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileType } from '../file/file.service';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Album, AlbumDocument } from '../album/schemas/album.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    private fileService: FileService,
  ) {}

  async create(
    createTrackDto: CreateTrackDto,
    picture: Express.Multer.File,
    audio: Express.Multer.File,
  ): Promise<Track> {
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);

    const track = await this.trackModel.create({
      ...createTrackDto,
      picture: picturePath,
      audio: audioPath,
    });

    if (createTrackDto.album) {
      const album = await this.albumModel.findById(createTrackDto.album);
      album.tracks.push(track._id);
      album.save();
    }

    return track;
  }

  async update(
    id: ObjectId,
    updateTrackDto: UpdateTrackDto,
    picture?: Express.Multer.File,
    audio?: Express.Multer.File,
  ): Promise<Track> {
    let track = await this.trackModel.findById(id);

    if (picture) {
      if (track.picture) this.fileService.removeFile(track.picture);

      updateTrackDto.picture = this.fileService.createFile(
        FileType.IMAGE,
        picture,
      );
    }

    if (audio) {
      if (track.audio) this.fileService.removeFile(track.audio);
      updateTrackDto.audio = this.fileService.createFile(FileType.AUDIO, audio);
    }

    track = await this.trackModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateTrackDto,
        },
      },
      { new: true },
    );

    if (updateTrackDto.album) {
      const album = await this.albumModel.findById(updateTrackDto.album);
      if (!album.tracks.includes(track._id)) {
        album.tracks.push(track._id);
        await album.save();
      }
    }

    return track;
  }

  async getAll(limit = 10, offset = 0, query = ''): Promise<Track[]> {
    const filter = {
      name: { $regex: new RegExp(query, 'i') },
    };
    return this.trackModel.find(filter).skip(offset).limit(limit);
  }

  async getOne(id: ObjectId): Promise<Track> {
    return this.trackModel.findById(id).populate(['comments', 'album']);
  }

  async delete(id: ObjectId): Promise<Track> {
    try {
      const track = await this.trackModel.findById(id);
      if (track.picture) this.fileService.removeFile(track.picture);
      if (track.audio) this.fileService.removeFile(track.audio);

      await this.commentModel.deleteMany({
        _id: { $in: track.comments },
      });
      track.remove();

      return track;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(createCommentDto.trackId);
    const comment = await this.commentModel.create(createCommentDto);
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId): Promise<Track> {
    return this.trackModel.findByIdAndUpdate(
      id,
      {
        $inc: { listeners: 1 },
      },
      { new: true },
    );
  }
}
