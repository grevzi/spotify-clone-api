import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('/api/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(
    @Body() createTrackDto: CreateTrackDto,
    @UploadedFiles()
    files,
  ) {
    const { picture, audio } = files;
    return this.trackService.create(createTrackDto, picture[0], audio[0]);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  update(
    @Param('id') id: ObjectId,
    @Body() updateTrackDto: UpdateTrackDto,
    @UploadedFiles()
    files,
  ) {
    const { picture, audio } = files;
    return this.trackService.update(
      id,
      updateTrackDto,
      picture ? picture[0] : null,
      audio ? audio[0] : null,
    );
  }

  @Get()
  getAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
  ) {
    return this.trackService.getAll(limit, offset, query);
  }

  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: ObjectId,
    @Body() dto: { username: string; text: string },
  ) {
    return this.trackService.addComment({ ...dto, trackId: id });
  }

  @Patch(':id/listen')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
