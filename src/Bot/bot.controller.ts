import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { botService } from './bot.service';
import {
  BotStatusResponseDto,
  BroadcastMessageDto,
  ConfigurationResponseDto,
  BroadcastResponseDto,
} from './dto/bot.dto';

@ApiTags('bot')
@ApiSecurity('api_key')
@Controller('bot')
export class botController {
  constructor(private readonly botService: botService) {}

  @Post('broadcast')
  @ApiOperation({
    summary: 'Broadcast a message to bot channel',
    description:
      'Send a text, photo, or video message to the configured bot channel using load-balanced bots',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message broadcasted successfully',
    type: BroadcastResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid message format or missing required fields',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async broadcastMessage(
    @Body() messageDto: BroadcastMessageDto,
  ): Promise<BroadcastResponseDto> {
    return this.botService.broadcastMessage(messageDto);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get bot status',
    description:
      'Retrieve current status of bot bots including active operations and utilization',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bot status retrieved successfully',
    type: BotStatusResponseDto,
    isArray: true,
  })
  async getBotStatus(): Promise<BotStatusResponseDto[]> {
    return this.botService.getBotStatus();
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get configuration info',
    description:
      'Retrieve current configuration information including allowed media types and bot settings',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration retrieved successfully',
    type: ConfigurationResponseDto,
  })
  async getConfiguration(): Promise<ConfigurationResponseDto> {
    return this.botService.getConfiguration();
  }
}
