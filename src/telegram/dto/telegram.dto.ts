import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';

export enum MessageType {
  TEXT = 'text',
  PHOTO = 'photo',
  VIDEO = 'video',
}

export class BroadcastMessageDto {
  @ApiProperty({
    description: 'Message text or caption for media',
    example: 'Hello everyone! Check out this photo.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    enum: MessageType,
    default: MessageType.TEXT,
    description: 'Type of message to broadcast',
  })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;

  @ApiPropertyOptional({
    description: 'URL of the media to be sent (required for photo/video types)',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsOptional()
  mediaUrl?: string;
}

export class BotStatusResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the bot',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Number of current active operations',
    example: 5,
  })
  activeOperations: number;

  @ApiProperty({
    description: 'Maximum allowed concurrent operations',
    example: 10,
  })
  maxOperations: number;

  @ApiProperty({
    description: 'Current utilization percentage',
    example: 50,
  })
  utilizationPercentage: number;
}

export class ConfigurationResponseDto {
  @ApiProperty({
    description: 'List of allowed media types',
    example: ['photo', 'video'],
    isArray: true,
  })

  @ApiProperty({
    description: 'Whether the target channel is properly configured',
    example: true,
  })
  channelConfigured: boolean;

  @ApiProperty({
    description: 'Total number of configured bots',
    example: 3,
  })
  botsCount: number;

  @ApiProperty({
    description: 'Maximum concurrent operations allowed per bot',
    example: 10,
  })
  maxOperationsPerBot: number;
}

export class BroadcastResponseDto {
  @ApiProperty({
    description: 'Whether the broadcast was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Message ID in the channel (if available)',
    example: '12345',
    required: false,
  })
  messageId?: string;

  @ApiProperty({
    description: 'Timestamp of the broadcast',
    example: '2025-05-01T12:00:00Z',
  })
  timestamp: string;
}
