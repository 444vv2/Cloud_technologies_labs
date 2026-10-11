import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Test1234@',
    description: 'Мінімум 8 символів, велика й мала літери, цифра, спеціальний символ',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
