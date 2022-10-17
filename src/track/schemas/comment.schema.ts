import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from './track.schema';
import { Factory } from 'nestjs-seeder';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Factory((faker) => `${faker.name.fullName()}`)
  @Prop()
  username: string;

  @Factory((faker) => `${faker.lorem.paragraph()}`)
  @Prop()
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
  track: Track;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Factory('Seeder')
  @Prop({ type: String, default: 'Spotify' })
  created_by: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
