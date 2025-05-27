import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { botService } from './bot.service';
import { botLoadBalancer } from './bot.load-balancer';

@Module({
  imports: [ConfigModule],
  providers: [botService, botLoadBalancer],
  exports: [botService],
})
export class botModule {}
