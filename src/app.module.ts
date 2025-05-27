import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './files/file.module';
import { botModule } from './Bot/bot.module';
import botConfig from './config/bot.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [botConfig],
    }),
    FileModule.register(),
    botModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
