import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramLoadBalancer } from './telegram.load-balancer';

@Module({
  imports: [ConfigModule],
  providers: [TelegramService, TelegramLoadBalancer],
  exports: [TelegramService],
})
export class TelegramModule {}
