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
  BroadcastMessageDto 
} from './dto/telegram.dto';

@ApiTags('Telegram')
@ApiSecurity('api_key')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
}
