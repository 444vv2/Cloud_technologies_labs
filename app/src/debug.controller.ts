import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  
  @ApiOperation({ summary: 'Test 5xx error for CloudWatch alarm' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('error')
  fail() {
    throw new InternalServerErrorException('Test 5xx for CloudWatch alarm');
  }
}