import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Public()
@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check the health of the application' })
  @ApiResponse({ status: 200, description: 'The application is healthy.' })
  check() {
    return { status: 'ok' };
  }
}