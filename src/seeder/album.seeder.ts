import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';
import { Album } from '../album/schemas/album.schema';
import { Comment } from '../track/schemas/comment.schema';
import { Track } from '../track/schemas/track.schema';

@Injectable()
export class AlbumSeeder implements Seeder {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Track.name) private readonly trackModel: Model<Track>,
    @InjectModel(Album.name) private readonly albumModel: Model<Album>,
  ) {}

  async seed(): Promise<any> {
    const comments = DataFactory.createForClass(Comment).generate(2, {
      created_by: 'Seeder',
    });

    const commentsDocs = await this.commentModel.insertMany(comments);

    const tracks = DataFactory.createForClass(Track).generate(2, {
      created_by: 'Seeder',
      comments: commentsDocs.map((i) => i._id),
    });

    const tracksDocs = await this.trackModel.insertMany(tracks);

    const albums = DataFactory.createForClass(Album).generate(10, {
      created_by: 'Seeder',
      tracks: tracksDocs.map((i) => i._id),
    });

    return await this.albumModel.insertMany(albums);
  }

  async drop(): Promise<any> {
    await this.commentModel.deleteMany({ created_by: 'Seeder' });
    await this.trackModel.deleteMany({ created_by: 'Seeder' });
    return this.albumModel.deleteMany({ created_by: 'Seeder' });
  }
}
