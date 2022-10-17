import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Album } from '../../album/schemas/album.schema';
import { Factory } from 'nestjs-seeder';
import { Comment } from './comment.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Factory((faker) => `${faker.music.songName()}`)
  @Prop()
  name: string;

  @Factory((faker) => `${faker.name.fullName()}`)
  @Prop()
  artist: string;

  @Factory((faker) => `${faker.lorem.paragraph()}`)
  @Prop()
  text: string;

  @Prop({ type: Number, default: 0 })
  listeners: number;

  @Factory((faker) => faker.image.abstract(300, 300, true))
  @Prop()
  picture: string;

  @Factory('6a5fbce1-b8d3-48e8-b0d4-106b0144c00d.mp3')
  @Prop()
  audio: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;

  @Factory((_, ctx) => ctx?.comments ?? [])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Factory('Seeder')
  @Prop({ type: String, default: 'Spotify' })
  created_by: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
