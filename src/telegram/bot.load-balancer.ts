import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { tgBotConfig } from '../config/bot.config';

@Injectable()
export class TelegramLoadBalancer {
  private readonly bots: Array<{
    bot: TelegramBot;
    operationCount: number;
    config: tgBotConfig;
  }> = [];
  private readonly logger = new Logger(TelegramLoadBalancer.name);

  getBotOperationCount(bot: TelegramBot): number {
    const botInfo = this.bots.find((b) => b.bot === bot);
    return botInfo?.operationCount || 0;
  }

  getBotMaxOperations(bot: TelegramBot): number {
    const botInfo = this.bots.find((b) => b.bot === bot);
    return botInfo?.config.maxConcurrentOperations || 0;
  }

  getBotUtilizationPercentage(bot: TelegramBot): number {
    const maxOps = this.getBotMaxOperations(bot);
    if (!maxOps) return 0;
    return (this.getBotOperationCount(bot) / maxOps) * 100;
  }

  public addBot(config: tgBotConfig): void {
    const bot = new TelegramBot(config.token, { polling: true });
    this.bots.push({
      bot,
      operationCount: 0,
      config,
    });
    this.logger.log(
      `Added new bot to the pool. Total bots: ${this.bots.length}`,
    );
  }

  public getNextBot(): TelegramBot {
    if (!this.bots.length) {
      throw new Error('No bots available in the pool');
    }

    // Find bot with least operations
    const selectedBot = this.bots.reduce((prev, curr) => {
      return prev.operationCount <= curr.operationCount ? prev : curr;
    });

    if (
      selectedBot.operationCount >= selectedBot.config.maxConcurrentOperations
    ) {
      // this.logger.warn('All bots are at maximum capacity');
      // Return least loaded bot anyway as fallback
    }

    selectedBot.operationCount++;
    return selectedBot.bot;
  }

  public releaseBot(bot: TelegramBot): void {
    const botInfo = this.bots.find((b) => b.bot === bot);
    if (botInfo) {
      botInfo.operationCount = Math.max(0, botInfo.operationCount - 1);
    }
  }

  public getAllBots(): TelegramBot[] {
    return this.bots.map((b) => b.bot);
  }

  public getBotToken(bot: TelegramBot): string | undefined {
    const botInfo = this.bots.find((b) => b.bot === bot);
    return botInfo?.config.token;
  }

  public getBotByToken(token: string): TelegramBot | undefined {
    for (const botInfo of this.bots) {
      if (botInfo.config.token === token) {
        return botInfo.bot;
      }
    }
    return undefined;
  }

  public getBots() {
    return this.bots;
  }
}
