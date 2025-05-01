import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  HttpStatus, 
  UsePipes, 
  ValidationPipe 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiSecurity 
} from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { 
  BotStatusResponseDto, 
  BroadcastMessageDto,
  ConfigurationResponseDto,
  BroadcastResponseDto
} from './dto/telegram.dto';

@ApiTags('Telegram')
@ApiSecurity('api_key')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('broadcast')
  @ApiOperation({
    summary: 'Broadcast a message to Telegram channel',
    description: 'Send a text, photo, or video message to the configured Telegram channel using load-balanced bots'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message broadcasted successfully',
    type: BroadcastResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid message format or missing required fields'
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async broadcastMessage(@Body() messageDto: BroadcastMessageDto): Promise<BroadcastResponseDto> {
    return this.telegramService.broadcastMessage(messageDto);
  }

  @Get('status')
  @ApiOperation({
    summary: 'Get bot status',
    description: 'Retrieve current status of Telegram bots including active operations and utilization'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bot status retrieved successfully',
    type: BotStatusResponseDto,
    isArray: true
  })
  async getBotStatus(): Promise<BotStatusResponseDto[]> {
    return this.telegramService.getBotStatus();
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get configuration info',
    description: 'Retrieve current configuration information including allowed media types and bot settings'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Configuration retrieved successfully',
    type: ConfigurationResponseDto
  })
  async getConfiguration(): Promise<ConfigurationResponseDto> {
    return this.telegramService.getConfiguration();
  }
}
