import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly repo: Repository<Song>,
    private readonly artists: ArtistsService,
  ) {}

  async create(dto: CreateSongDto) {
    const artist = await this.artists.findOne(dto.artistId);
    return this.repo.save(this.repo.create({ ...dto, artist }));
  }

  findAll(artistId?: string) {
    return this.repo.find({
      where: artistId ? { artistId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const song = await this.repo.findOneBy({ id });
    if (!song) throw new NotFoundException(`Song ${id} not found`);
    return song;
  }

  async update(id: string, dto: UpdateSongDto) {
    const song = await this.findOne(id);
    if (dto.artistId && dto.artistId !== song.artistId) {
      song.artist = await this.artists.findOne(dto.artistId);
    }
    return this.repo.save(Object.assign(song, dto));
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    await this.repo.remove(song);
  }
}
