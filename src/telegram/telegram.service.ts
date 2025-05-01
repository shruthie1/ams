import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramLoadBalancer } from './telegram.load-balancer';
import { TelegramConfig } from '../config/telegram.config';
import {
  BroadcastMessageDto,
  BotStatusResponseDto,
  ConfigurationResponseDto,
  BroadcastResponseDto,
  MessageType
} from './dto/telegram.dto';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly loadBalancer: TelegramLoadBalancer,
  ) {}

  async onModuleInit() {
    await this.initializeBots();
  }
  private async initializeBots() {
    try {
      const config = this.configService.get<TelegramConfig>('telegram');
      if (!config?.bots?.length) {
        this.logger.warn('No Telegram bots configured');
        return;
      }

      this.logger.log('Initializing Telegram service with configuration:', {
        totalBots: config.bots.length,
        totalChannels: config.channels.length,
        channelInfo: config.channels.map(c => ({
          channelId: c.channelId,
          description: c.description || 'no description',
          assignedBots: c.botTokens.length
        }))
      });

      // Initialize each bot with the load balancer
      config.bots.forEach(botConfig => {
        this.logger.debug(`Adding bot ${botConfig.token.slice(0, 6)}... to load balancer`);
        this.loadBalancer.addBot(botConfig);
      });

      // Setup message handlers for each bot
      const bots = this.loadBalancer.getAllBots();
      this.logger.debug(`Setting up message handlers for ${bots.length} bots`);
      bots.forEach(bot => {
        this.setupMessageHandlers(bot);
      });

      this.logger.log(`Initialized ${config.bots.length} Telegram bots`);
    } catch (error) {
      this.logger.error('Failed to initialize Telegram bots:', error);
      throw error;
    }
  }

  private setupMessageHandlers(bot: TelegramBot) {
    bot.on('message', async (msg) => {
      try {
        await this.handleIncomingMessage(bot, msg);
      } catch (error) {
        this.logger.error(`Error handling message: ${error.message}`, error.stack);
      }
    });

    bot.on('error', (error) => {
      this.logger.error(`Bot error: ${error.message}`, error.stack);
    });
  }
  private async handleIncomingMessage(bot: TelegramBot, message: TelegramBot.Message) {
    // Only handle messages from private chats
    if (message.chat.type !== 'private') {
      this.logger.debug(`Skipping non-private message from chat ${message.chat.id} (type: ${message.chat.type})`);
      return;
    }

    try {
      const config = this.configService.get<TelegramConfig>('telegram');
      const botToken = this.loadBalancer.getBotToken(bot);
      
      this.logger.debug(`Processing message from chat ${message.chat.id} using bot ${botToken}`);
      this.logger.debug(`Available channels: ${JSON.stringify(config.channels.map(c => ({
        id: c.channelId,
        description: c.description,
        botCount: c.botTokens.length
      })))}`);
      
      // Find matching channel for this bot
      const matchingChannel = config.channels.find(channel => {
        const hasToken = channel.botTokens.includes(botToken);
        this.logger.debug(`Checking channel ${channel.channelId} (${channel.description || 'no description'}): ${hasToken ? 'matches' : 'no match'}`);
        return hasToken;
      });      if (!matchingChannel) {
        this.logger.warn(`No matching channel found for bot token: ${botToken}`);
        if (config.adminChatId) {
          await bot.sendMessage(
            config.adminChatId,
            `⚠️ Configuration issue: No channel configured for bot token: ${botToken.slice(0, 6)}...`
          );
        }
        return;
      }

      this.logger.debug(`Forwarding message ${message.message_id} to channel ${matchingChannel.channelId} (${matchingChannel.description || 'no description'})`);
      
      // Try to forward the message using the current bot
      try {
        await bot.forwardMessage(
          matchingChannel.channelId,
          message.chat.id,
          message.message_id
        );
        this.logger.debug(`Successfully forwarded message ${message.message_id} using primary bot`);
      } catch (error) {
        this.logger.warn(`Failed to forward message with original bot: ${error.message}`);
          // Try with a different bot as fallback
        const fallbackBot = this.loadBalancer.getNextBot();
        if (fallbackBot !== bot) {
          this.logger.debug(`Attempting to forward message ${message.message_id} using fallback bot`);
          await fallbackBot.forwardMessage(
            matchingChannel.channelId,
            message.chat.id,
            message.message_id
          );
          this.logger.debug(`Successfully forwarded message ${message.message_id} using fallback bot`);
        } else {
          this.logger.error(`No alternative bot available for fallback`);
          throw error; // Re-throw if no other bot is available
        }
      }

      // Send confirmation to admin if configured
      if (config.adminChatId) {
        this.logger.debug(`Notifying admin about forwarded message`);
        await bot.sendMessage(
          config.adminChatId,
          `Message forwarded to channel ${matchingChannel.channelId}`
        );
      }
    } catch (error) {
      this.logger.error(`Failed to handle message: ${error.message}`, error.stack);
      
      // Notify admin of failure if configured
      const config = this.configService.get<TelegramConfig>('telegram');
      if (config.adminChatId) {
        await bot.sendMessage(
          config.adminChatId,
          `Failed to forward message: ${error.message}`
        );
      }
    }
  }
  async broadcastMessage(messageDto: BroadcastMessageDto): Promise<BroadcastResponseDto> {
    try {
      const bot = this.loadBalancer.getNextBot();
      const config = this.configService.get<TelegramConfig>('telegram');
      const channel = config.channels[0]; // Using first channel for broadcasting

      let messageId: string;

      switch (messageDto.type) {
        case MessageType.PHOTO:
          if (!messageDto.mediaUrl) {
            throw new Error('Media URL is required for photo messages');
          }
          const photoResult = await bot.sendPhoto(channel.channelId, messageDto.mediaUrl, {
            caption: messageDto.message
          });
          messageId = photoResult.message_id.toString();
          break;

        case MessageType.VIDEO:
          if (!messageDto.mediaUrl) {
            throw new Error('Media URL is required for video messages');
          }
          const videoResult = await bot.sendVideo(channel.channelId, messageDto.mediaUrl, {
            caption: messageDto.message
          });
          messageId = videoResult.message_id.toString();
          break;

        case MessageType.TEXT:
        default:
          const textResult = await bot.sendMessage(channel.channelId, messageDto.message);
          messageId = textResult.message_id.toString();
          break;
      }

      return {
        success: true,
        messageId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Failed to broadcast message:', error);
      return {
        success: false,
        timestamp: new Date().toISOString()
      };
    }
  }
  async getBotStatus(): Promise<BotStatusResponseDto[]> {
    const bots = this.loadBalancer.getBots() || [];
    const botStats = bots.map((botInfo, index) => {
      const operations = this.loadBalancer.getBotOperationCount(botInfo.bot);
      const maxOps = this.loadBalancer.getBotMaxOperations(botInfo.bot);
      return {
        id: index + 1,
        activeOperations: operations,
        maxOperations: maxOps,
        utilizationPercentage: this.loadBalancer.getBotUtilizationPercentage(botInfo.bot)
      };
    });
    return botStats;
  }

  async getConfiguration(): Promise<ConfigurationResponseDto> {
    const config = this.configService.get<TelegramConfig>('telegram');
    const firstBot = this.loadBalancer.getBots()?.[0]?.bot;
    return {
      channelConfigured: config.channels?.length > 0,
      botsCount: config.bots?.length || 0,
      maxOperationsPerBot: firstBot ? this.loadBalancer.getBotMaxOperations(firstBot) : 0
    };
  }
}