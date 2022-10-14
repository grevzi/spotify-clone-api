import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from '../../track/schemas/track.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({ type: String, default: 'Spotify' })
  created_by: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
