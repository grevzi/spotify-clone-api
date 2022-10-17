import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from '../../track/schemas/track.schema';
import { Factory } from 'nestjs-seeder';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Factory((faker) => `${faker.lorem.sentence(2)}`)
  @Prop()
  name: string;

  @Factory((faker) => faker.image.abstract(300, 300, true))
  @Prop()
  picture: string;

  @Factory((_, ctx) => ctx?.tracks ?? [])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Factory('Seeder')
  @Prop({ type: String, default: 'Spotify' })
  created_by: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
