import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { CacheService } from './cache/cache.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@ApiTags('Debug12')
@Controller('debug')
export class DebugController {
  constructor(private readonly cache: CacheService) {}

  @ApiOperation({ summary: 'Cache hit/miss counters' })
  @Get('cache')
  cacheStats() {
    return this.cache.stats();
  }

  @ApiOperation({ summary: 'Test 5xx error for CloudWatch alarm' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get('error')
  fail() {
    throw new InternalServerErrorException('Test 5xx for CloudWatch alarm');
  }
}