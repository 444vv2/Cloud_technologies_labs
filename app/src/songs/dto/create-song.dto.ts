import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSongDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsUUID()
  artistId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  album?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;
}
