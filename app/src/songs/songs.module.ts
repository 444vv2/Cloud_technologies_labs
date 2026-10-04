import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { ArtistsModule } from '../artists/artists.module';

@Module({
  imports: [TypeOrmModule.forFeature([Song]), ArtistsModule],
  providers: [SongsService],
  controllers: [SongsController],
})
export class SongsModule {}
