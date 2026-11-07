import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ArtistsService } from '../artists/artists.service';
import { CacheService } from '../cache/cache.service';

const LIST_PREFIX = 'songs:list:';
const LIST_TTL_SEC = 45;

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly repo: Repository<Song>,
    private readonly artists: ArtistsService,
    private readonly cache: CacheService,
  ) {}

  async create(dto: CreateSongDto) {
    const artist = await this.artists.findOne(dto.artistId);
    const saved = await this.repo.save(this.repo.create({ ...dto, artist }));
    await this.cache.delByPrefix(LIST_PREFIX);
    return saved;
  }

  async findAll(artistId?: string) {
    const key = LIST_PREFIX + (artistId ?? 'all');
    const cached = await this.cache.get<Song[]>(key);
    if (cached) return cached;
    const songs = await this.repo.find({
      where: artistId ? { artistId } : {},
      order: { createdAt: 'DESC' },
    });
    await this.cache.set(key, songs, LIST_TTL_SEC);
    return songs;
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
    const saved = await this.repo.save(Object.assign(song, dto));
    await this.cache.delByPrefix(LIST_PREFIX);
    return saved;
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    await this.repo.remove(song);
    await this.cache.delByPrefix(LIST_PREFIX);
  }
}
