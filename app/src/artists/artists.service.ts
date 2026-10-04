import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist) private readonly repo: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto) {
    await this.ensureNameFree(dto.name);
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const artist = await this.repo.findOneBy({ id });
    if (!artist) throw new NotFoundException(`Artist ${id} not found`);
    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.findOne(id);
    if (dto.name && dto.name !== artist.name)
      await this.ensureNameFree(dto.name);
    return this.repo.save(Object.assign(artist, dto));
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    await this.repo.remove(artist);
  }

  private async ensureNameFree(name: string) {
    if (await this.repo.existsBy({ name })) {
      throw new ConflictException(`Artist "${name}" already exists`);
    }
  }
}
