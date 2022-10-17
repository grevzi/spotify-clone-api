import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Factory((faker) => `${faker.name.fullName()}`)
  @Prop()
  name: string;

  @Factory((faker, ctx) => faker.internet.email(ctx.name))
  @Prop()
  email: string;

  @Factory('$2b$10$Y.gA4h0CvXg/wxb9eGhf9.bStQVQ2HHTAT9l/7fskrB3a6STGgbSS')
  @Prop()
  password: string;

  @Factory((faker) => faker.image.avatar())
  @Prop()
  picture: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Factory('Seeder')
  @Prop({ type: String, default: '' })
  created_by: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
