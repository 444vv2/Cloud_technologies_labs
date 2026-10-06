import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songs: SongsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new song' })
  @ApiResponse({ status: 201, description: 'The song has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreateSongDto) {
    return this.songs.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all songs, optionally filtered by artist ID' })
  @ApiResponse({ status: 200, description: 'List of songs.' })
  findAll(@Query('artistId', new ParseUUIDPipe({ optional: true })) artistId?: string) {
    return this.songs.findAll(artistId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  @ApiResponse({ status: 200, description: 'The song was found.' })
  @ApiResponse({ status: 404, description: 'The song was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.songs.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a song by ID' })
  @ApiResponse({ status: 200, description: 'The song has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'The song was not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSongDto) {
    return this.songs.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song by ID' })
  @ApiResponse({ status: 204, description: 'The song has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'The song was not found.' })
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.songs.remove(id);
  }
}