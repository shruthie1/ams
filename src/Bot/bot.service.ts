import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bot from 'node-telegram-bot-api';
import { botLoadBalancer } from './bot.load-balancer';
import botConfig, { BotUtils, tgConfig } from '../config/bot.config';
import {
  BroadcastMessageDto,
  BotStatusResponseDto,
  ConfigurationResponseDto,
  BroadcastResponseDto,
  MessageType,
} from './dto/bot.dto';

@Injectable()
export class botService implements OnModuleInit {
  private readonly logger = new Logger(botService.name);
  private readonly config: tgConfig;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second
  private messageQueue: Map<
    string,
    {
      retries: number;
      message: bot.Message;
      channelId: string;
    }
  > = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly loadBalancer: botLoadBalancer,
  ) {
    this.config = this.configService.get<tgConfig>('bot');
  }

  async onModuleInit() {
    this.logger.log('Initializing bot service...');
    await this.initializeBots();
    this.startMessageQueueProcessor();
    this.logger.log('bot service initialized successfully');
  }

  private async initializeBots() {
    if (!this.config?.bots?.length) {
      this.logger.warn('No bots configured in bot config');
      return;
    }

    this.logger.debug(`Initializing ${this.config.bots.length} bots...`);
    const initPromises = this.config.bots.map(async (botConfig) => {
      try {
        this.loadBalancer.addBot(botConfig);
        const bot = this.loadBalancer.getBotByToken(botConfig.token);
        if (bot) {
          this.setupMessageHandlers(bot);
          const botInfo = await bot.getMe();
          this.logger.log(`Bot @${botInfo.username} initialized successfully`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to initialize bot with token ${botConfig.token.slice(0, 6)}...`,
          error.stack,
        );
        this.queueBotRecovery(botConfig);
      }
    });

    await Promise.allSettled(initPromises);
  }

  private queueBotRecovery(botConfig: any) {
    this.logger.debug(
      `Queuing recovery for bot with token ${botConfig.token.slice(0, 6)}...`,
    );
    setTimeout(() => {
      try {
        this.loadBalancer.addBot(botConfig);
        const bot = this.loadBalancer.getBotByToken(botConfig.token);
        if (bot) {
          this.setupMessageHandlers(bot);
          this.logger.log(
            `Successfully recovered bot with token ${botConfig.token.slice(0, 6)}...`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to recover bot with token ${botConfig.token.slice(0, 6)}...`,
          error.stack,
        );
        this.logger.warn(
          `Bot recovery failed, retrying... Token: ${botConfig.token.slice(0, 6)}...`,
        );
        this.queueBotRecovery(botConfig);
      }
    }, this.RETRY_DELAY);
  }

  private startMessageQueueProcessor() {
    this.logger.log('Starting message queue processor');
    setInterval(() => this.processMessageQueue(), 1000);
  }

  private async processMessageQueue() {
    if (this.messageQueue.size === 0) return;

    this.logger.debug(
      `Processing message queue. Size: ${this.messageQueue.size}`,
    );
    for (const [messageId, queueItem] of this.messageQueue) {
      const bot = this.loadBalancer.getNextBot();
      try {
        await this.forwardMessage(bot, queueItem.message, queueItem.channelId);
        this.messageQueue.delete(messageId);
        this.logger.debug(`Successfully processed queued message ${messageId}`);
      } catch (error) {
        if (queueItem.retries >= this.MAX_RETRIES) {
          this.messageQueue.delete(messageId);
          this.logger.error(
            `Failed to forward message ${messageId} after ${this.MAX_RETRIES} ${(await bot.getMe()).username} retries:`,
            error.stack,
          );
          this.notifyAdmin(
            `Failed to forward message after ${this.MAX_RETRIES} retries: ${error.message}`,
          );
        } else {
          queueItem.retries++;
          this.logger.warn(
            `Retry ${queueItem.retries}/${this.MAX_RETRIES} for message ${messageId}`,
          );
        }
      }
    }
  }

  private setupMessageHandlers(bot: bot) {
    bot.on('message', (msg) => {
      this.handleIncomingMessage(bot, msg).catch((error) =>
        this.handleMessageError(error, msg, bot),
      );
    });

    bot.on('error', (error) => {
      this.notifyAdmin(`Bot error occurred: ${error.message}`);
    });
  }

  private async handleMessageError(
    error: Error,
    message: bot.Message,
    bot: bot,
  ) {
    const messageId = `${message.chat.id}-${message.message_id}`;
    const botToken = this.loadBalancer.getBotToken(bot);
    const matchingChannel = this.config.channels.find((channel) =>
      channel.botTokens.includes(botToken),
    );
    if (!this.messageQueue.has(messageId)) {
      this.messageQueue.set(messageId, {
        retries: 0,
        message,
        channelId: matchingChannel?.channelId,
      });
    }
    await this.notifyAdmin(`Message queued for retry: ${error.message}`);
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
    bot: bot,
    message: bot.Message,
  ) {
    const messageId = `${message.chat.id}-${message.message_id}`;

    // Only handle messages from private chats
    // if (message.chat.type !== 'private') {
    //   this.logger.debug(`Skipping non-private message ${messageId}`);
    //   return;
    // }

    // Skip messages containing 'start' (case insensitive)
    if (message.text?.toLowerCase().startsWith('start')) {
      this.logger.debug(`Skipping start command message ${messageId}`);
      return;
    }

    const botToken = this.loadBalancer.getBotToken(bot);
    const matchingChannel = this.config.channels.find((channel) =>
      channel.botTokens.includes(botToken),
    );

    if (!matchingChannel) {
      this.logger.warn(
        `No channel configured for bot token: ${botToken.slice(0, 6)}...`,
      );
      await this.notifyAdmin(
        `⚠️ Configuration issue: No channel configured for bot token: ${botToken.slice(0, 6)}...`,
      );
      return;
    }

    try {
      await this.forwardMessageWithRetry(
        bot,
        message,
        matchingChannel.channelId,
      );
      await this.notifyAdmin(
        `Message forwarded to channel ${matchingChannel.channelId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to forward message ${messageId}, queueing for retry: ${error.message}`,
      );
      this.messageQueue.set(messageId, {
        retries: 0,
        message,
        channelId: matchingChannel.channelId,
      });
      await this.notifyAdmin(`Message queued for retry: ${error.message}`);
    }
  }

  private async forwardMessageWithRetry(
    bot: bot,
    message: bot.Message,
    channelId: string,
    retryCount = 0,
  ): Promise<void> {
    const messageId = `${message.chat.id}-${message.message_id}`;
    try {
      await this.forwardMessage(bot, message, channelId);
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        this.logger.debug(
          `Retry attempt ${retryCount + 1} failed, switching to next bot`,
        );
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        const nextBot = this.loadBalancer.getNextBot();
        return this.forwardMessageWithRetry(
          nextBot,
          message,
          channelId,
          retryCount + 1,
        );
      }
      this.logger.error(`All retry attempts failed for message ${messageId}`);
      throw error;
    }
  }

  private async forwardMessage(
    bot: bot,
    message: bot.Message,
    channelId: string,
  ): Promise<void> {
    const messageId = `${message.chat.id}-${message.message_id}`;
    try {
      await bot.forwardMessage(channelId, message.chat.id, message.message_id);
      this.logger.debug(`Message ${messageId} forwarded successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to forward message ${messageId} using bot... ${(await bot.getMe()).username}, Text: ${message.text}, Channel: ${channelId }`,
        error.stack,
      );
      this.logger.debug(
        `Forward attempt failed, trying fallback bot for message ${messageId}`,
      );
      const fallbackBot = this.loadBalancer.getNextBot();
      if (fallbackBot === bot) {
        this.logger.error(
          `No available bots for forwarding message ${messageId}`,
        );
        throw new Error('No available bots for forwarding');
      }

      await fallbackBot.forwardMessage(
        channelId,
        message.chat.id,
        message.message_id,
      );
      this.logger.debug(
        `Message ${messageId} forwarded successfully using fallback bot`,
      );
    }
  }

  async broadcastMessage(
    messageDto: BroadcastMessageDto,
  ): Promise<BroadcastResponseDto> {
    this.logger.debug('Starting broadcast message operation');
    try {
      const bot = this.loadBalancer.getNextBot();
      const channel = this.config.channels[0];

      const result = await this.sendMessageByType(
        bot,
        channel.channelId,
        messageDto,
      );
      this.logger.log(
        `Successfully broadcasted message with ID: ${result.message_id}`,
      );

      return {
        success: true,
        messageId: result.message_id.toString(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to broadcast message:', error.stack);
      return {
        success: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async sendMessageByType(
    bot: bot,
    channelId: string,
    messageDto: BroadcastMessageDto,
  ): Promise<bot.Message> {
    this.logger.debug(
      `Sending ${messageDto.type} message to channel ${channelId}`,
    );
    switch (messageDto.type) {
      case MessageType.PHOTO:
        if (!messageDto.mediaUrl) {
          this.logger.error('Media URL is required for photo messages');
          throw new Error('Media URL is required for photo messages');
        }
        return bot.sendPhoto(channelId, messageDto.mediaUrl, {
          caption: messageDto.message,
        });

      case MessageType.VIDEO:
        if (!messageDto.mediaUrl) {
          this.logger.error('Media URL is required for video messages');
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
    this.logger.debug('Fetching bot status information');
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
    this.logger.debug('Fetching bot service configuration');
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
