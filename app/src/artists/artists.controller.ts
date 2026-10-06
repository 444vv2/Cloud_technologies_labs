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
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Artists')
@Controller('artists')
export class ArtistsController {
  constructor(private readonly artists: ArtistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiResponse({ status: 201, description: 'The artist has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() dto: CreateArtistDto) {
    return this.artists.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists' })
  @ApiResponse({ status: 200, description: 'List of artists.' })
  findAll() {
    return this.artists.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an artist by ID' })
  @ApiResponse({ status: 200, description: 'The artist was found.' })
  @ApiResponse({ status: 404, description: 'The artist was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.artists.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artist by ID' })
  @ApiResponse({ status: 200, description: 'The artist has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'The artist was not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateArtistDto) {
    return this.artists.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiResponse({ status: 204, description: 'The artist has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'The artist was not found.' })
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.artists.remove(id);
  }
}
