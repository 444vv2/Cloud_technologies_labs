import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from './artists/artists.module';
import { SongsModule } from './songs/songs.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { DebugController } from './debug.controller';
import { Artist } from './artists/artist.entity';
import { Song } from './songs/song.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Artist, Song],
        synchronize: true,
        ssl:
          configService.get('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),
    ArtistsModule,
    SongsModule,
    AuthModule,
  ],
  controllers: [HealthController, DebugController],
})
export class AppModule {}
