import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Album } from '../../album/schemas/album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop()
  name: string;

  @Prop()
  artist: string;

  @Prop()
  text: string;

  @Prop({ type: Number, default: 0 })
  listeners: number;

  @Prop()
  picture: string;

  @Prop()
  audio: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: String, default: 'Spotify' })
  created_by: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
