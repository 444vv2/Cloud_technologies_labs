import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { ArtistsService } from '../artists/artists.service';
import { CacheService } from '../cache/cache.service';
import { QueueService } from '../queue/queue.service';

const LIST_PREFIX = 'songs:list:';
const LIST_TTL_SEC = 10;
const MAX_SONGS = 1000;

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private readonly repo: Repository<Song>,
    private readonly artists: ArtistsService,
    private readonly cache: CacheService,
    private readonly queue: QueueService,
  ) {}

  async create(dto: CreateSongDto) {
    if (!this.queue.asyncWrites) return this.insertSong(dto, randomUUID());
    await this.artists.findOne(dto.artistId);
    const id = randomUUID();
    await this.queue.send({ id, dto });
    return { id, status: 'pending' as const };
  }

  async insertSong(dto: CreateSongDto, id: string) {
    await this.repo
      .createQueryBuilder()
      .insert()
      .values({ ...dto, id })
      .orIgnore()
      .execute();
    return this.findOne(id);
  }

  async findAll(artistId?: string) {
    const key = LIST_PREFIX + (artistId ?? 'all');
    const cached = await this.cache.get<Song[]>(key);
    if (cached) return cached;
    const songs = await this.repo.find({
      where: artistId ? { artistId } : {},
      order: { createdAt: 'DESC' },
      take: MAX_SONGS,
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
