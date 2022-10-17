import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeeder } from './seeder/user.seeder';
import { User, UserSchema } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { AlbumSeeder } from './seeder/album.seeder';
import { Album, AlbumSchema } from './album/schemas/album.schema';
import { Track, TrackSchema } from './track/schemas/track.schema';
import { Comment, CommentSchema } from './track/schemas/comment.schema';

seeder({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.dev', '.env.local', '.env'],
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdw52n8.mongodb.net/?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
}).run([UserSeeder, AlbumSeeder]);
