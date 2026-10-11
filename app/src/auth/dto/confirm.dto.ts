import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Код підтвердження з листа',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
