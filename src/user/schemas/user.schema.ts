import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  picture: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
