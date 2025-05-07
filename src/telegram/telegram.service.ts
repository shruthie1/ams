import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { TelegramLoadBalancer } from './telegram.load-balancer';
import { TelegramConfig } from '../config/telegram.config';
import {
  BroadcastMessageDto,
  BotStatusResponseDto,
  ConfigurationResponseDto,
  BroadcastResponseDto,
  MessageType,
} from './dto/telegram.dto';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly config: TelegramConfig;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private messageQueue: Map<string, {
    retries: number;
    message: TelegramBot.Message;
    channelId: string;
  }> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly loadBalancer: TelegramLoadBalancer,
  ) {
    this.config = this.configService.get<TelegramConfig>('telegram');
  }

  async onModuleInit() {
    await this.initializeBots();
    this.startMessageQueueProcessor();
  }

  private async initializeBots() {
    if (!this.config?.bots?.length) return;
    
    const initPromises = this.config.bots.map(async botConfig => {
      try {
        this.loadBalancer.addBot(botConfig);
        const bot = this.loadBalancer.getBotByToken(botConfig.token);
        if (bot) {
          this.setupMessageHandlers(bot);
          // Test bot connectivity
          await bot.getMe();
        }
      } catch (error) {
        // If bot initialization fails, we'll try to recover later
        this.queueBotRecovery(botConfig);
      }
    });

    await Promise.allSettled(initPromises);
  }

  private queueBotRecovery(botConfig: any) {
    setTimeout(() => {
      try {
        this.loadBalancer.addBot(botConfig);
        const bot = this.loadBalancer.getBotByToken(botConfig.token);
        if (bot) {
          this.setupMessageHandlers(bot);
        }
      } catch {
        // If recovery fails, queue another attempt
        this.queueBotRecovery(botConfig);
      }
    }, this.RETRY_DELAY);
  }

  private startMessageQueueProcessor() {
    setInterval(() => this.processMessageQueue(), 1000);
  }

  private async processMessageQueue() {
    for (const [messageId, queueItem] of this.messageQueue) {
      try {
        const bot = this.loadBalancer.getNextBot();
        await this.forwardMessage(bot, queueItem.message, queueItem.channelId);
        this.messageQueue.delete(messageId);
      } catch (error) {
        if (queueItem.retries >= this.MAX_RETRIES) {
          this.messageQueue.delete(messageId);
          this.notifyAdmin(`Failed to forward message after ${this.MAX_RETRIES} retries: ${error.message}`);
        } else {
          queueItem.retries++;
        }
      }
    }
  }

  private setupMessageHandlers(bot: TelegramBot) {
    bot.on('message', msg => {
      this.handleIncomingMessage(bot, msg)
        .catch(error => this.handleMessageError(error, msg));
    });

    bot.on('error', error => {
      this.notifyAdmin(`Bot error occurred: ${error.message}`);
    });
  }

  private async handleMessageError(error: Error, message: TelegramBot.Message) {
    const messageId = `${message.chat.id}-${message.message_id}`;
    if (!this.messageQueue.has(messageId)) {
      this.messageQueue.set(messageId, {
        retries: 0,
        message,
        channelId: this.findChannelForMessage(message)
      });
    }
    await this.notifyAdmin(`Message queued for retry: ${error.message}`);
  }

  private findChannelForMessage(message: TelegramBot.Message): string {
    const availableChannel = this.config.channels[0];
    return availableChannel?.channelId;
  }

  private async notifyAdmin(message: string) {
    if (!this.config.adminChatId) return;
    
    try {
      const bot = this.loadBalancer.getNextBot();
      await bot.sendMessage(this.config.adminChatId, message);
    } catch {
      // Silent fail for admin notifications
    }
  }

  private async handleIncomingMessage(
    bot: TelegramBot,
    message: TelegramBot.Message,
  ) {
    // Only handle messages from private chats
    if (message.chat.type !== 'private') return;

    // Skip messages containing 'start' (case insensitive)
    if (message.text?.toLowerCase().startsWith('start')) {
      return;
    }

    const botToken = this.loadBalancer.getBotToken(bot);
    const matchingChannel = this.config.channels.find(channel =>
      channel.botTokens.includes(botToken)
    );

    if (!matchingChannel) {
      await this.notifyAdmin(
        `⚠️ Configuration issue: No channel configured for bot token: ${botToken.slice(0, 6)}...`
      );
      return;
    }

    try {
      await this.forwardMessageWithRetry(bot, message, matchingChannel.channelId);
      await this.notifyAdmin(`Message forwarded to channel ${matchingChannel.channelId}`);
    } catch (error) {
      // Queue message for retry if all immediate attempts fail
      const messageId = `${message.chat.id}-${message.message_id}`;
      this.messageQueue.set(messageId, {
        retries: 0,
        message,
        channelId: matchingChannel.channelId
      });
      await this.notifyAdmin(`Message queued for retry: ${error.message}`);
    }
  }

  private async forwardMessageWithRetry(
    bot: TelegramBot,
    message: TelegramBot.Message,
    channelId: string,
    retryCount = 0
  ): Promise<void> {
    try {
      await this.forwardMessage(bot, message, channelId);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        const nextBot = this.loadBalancer.getNextBot();
        return this.forwardMessageWithRetry(nextBot, message, channelId, retryCount + 1);
      }
      throw error;
    }
  }

  private async forwardMessage(
    bot: TelegramBot,
    message: TelegramBot.Message,
    channelId: string,
  ): Promise<void> {
    try {
      await bot.forwardMessage(
        channelId,
        message.chat.id,
        message.message_id,
      );
    } catch (error) {
      const fallbackBot = this.loadBalancer.getNextBot();
      if (fallbackBot === bot) {
        throw new Error('No available bots for forwarding');
      }
      
      await fallbackBot.forwardMessage(
        channelId,
        message.chat.id,
        message.message_id,
      );
    }
  }

  async broadcastMessage(
    messageDto: BroadcastMessageDto,
  ): Promise<BroadcastResponseDto> {
    try {
      const bot = this.loadBalancer.getNextBot();
      const channel = this.config.channels[0];

      const result = await this.sendMessageByType(bot, channel.channelId, messageDto);

      return {
        success: true,
        messageId: result.message_id.toString(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async sendMessageByType(
    bot: TelegramBot,
    channelId: string,
    messageDto: BroadcastMessageDto,
  ): Promise<TelegramBot.Message> {
    switch (messageDto.type) {
      case MessageType.PHOTO:
        if (!messageDto.mediaUrl) {
          throw new Error('Media URL is required for photo messages');
        }
        return bot.sendPhoto(channelId, messageDto.mediaUrl, {
          caption: messageDto.message,
        });

      case MessageType.VIDEO:
        if (!messageDto.mediaUrl) {
          throw new Error('Media URL is required for video messages');
        }
        return bot.sendVideo(channelId, messageDto.mediaUrl, {
          caption: messageDto.message,
        });

      case MessageType.TEXT:
      default:
        return bot.sendMessage(channelId, messageDto.message);
    }
  }

  async getBotStatus(): Promise<BotStatusResponseDto[]> {
    const bots = this.loadBalancer.getBots() || [];
    return bots.map((botInfo, index) => {
      const operations = this.loadBalancer.getBotOperationCount(botInfo.bot);
      const maxOps = this.loadBalancer.getBotMaxOperations(botInfo.bot);
      return {
        id: index + 1,
        activeOperations: operations,
        maxOperations: maxOps,
        utilizationPercentage: this.loadBalancer.getBotUtilizationPercentage(
          botInfo.bot,
        ),
      };
    });
  }

  async getConfiguration(): Promise<ConfigurationResponseDto> {
    const firstBot = this.loadBalancer.getBots()?.[0]?.bot;
    return {
      channelConfigured: this.config.channels?.length > 0,
      botsCount: this.config.bots?.length || 0,
      maxOperationsPerBot: firstBot
        ? this.loadBalancer.getBotMaxOperations(firstBot)
        : 0,
    };
  }
}
