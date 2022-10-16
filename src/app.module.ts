import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AlbumModule } from './album/album.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.prod', '.env.dev', '.env.local', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vdw52n8.mongodb.net/?retryWrites=true&w=majority`,
    ),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    TrackModule,
    AlbumModule,
    FileModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
