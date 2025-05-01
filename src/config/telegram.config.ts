import { registerAs } from '@nestjs/config';

export interface TelegramBotConfig {
  token: string;
  maxConcurrentOperations: number;
}

export interface TelegramChannelConfig {
  channelId: string;
  description?: string;
  botTokens: string[]; // List of bot tokens that can forward to this channel
}

export interface TelegramConfig {
  bots: TelegramBotConfig[];
  channels: TelegramChannelConfig[];
  adminChatId?: string;
}

export default registerAs('telegram', () => {
  const maxOps = parseInt(process.env.TELEGRAM_BOT_MAX_OPERATIONS || '10');
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  // Parse channel configurations from environment variables
  const channelConfigs = parseChannelConfigs();

  if (!channelConfigs.length) {
    console.warn('No Telegram channel configurations found!');
  } else {
    console.log(
      'Parsed channel configurations:',
      channelConfigs.map((channel) => ({
        channelId: channel.channelId,
        description: channel.description || 'no description',
        botCount: channel.botTokens.length,
      })),
    );
  }

  // Extract unique bot tokens from channel configurations
  const uniqueBotTokens = new Set<string>();
  const botChannelMapping = new Map<string, string[]>();

  channelConfigs.forEach((channel) => {
    channel.botTokens.forEach((token) => {
      uniqueBotTokens.add(token);
      const channels = botChannelMapping.get(token) || [];
      channels.push(channel.channelId);
      botChannelMapping.set(token, channels);
    });
  });

  if (!uniqueBotTokens.size) {
    console.warn('No Telegram bot tokens found in channel configurations!');
  }

  const config: TelegramConfig = {
    bots: Array.from(uniqueBotTokens).map((token) => ({
      token: token.trim(),
      maxConcurrentOperations: maxOps,
    })),
    channels: channelConfigs,
    adminChatId,
  };
  console.log('Loaded Telegram configuration:', {
    botsCount: config.bots.length,
    channelsCount: config.channels.length,
    botMappings: Array.from(botChannelMapping.entries()).map(
      ([token, channels]) => ({
        botToken: `${token.slice(0, 6)}...`,
        channels,
      }),
    ),
    hasAdminChatId: !!config.adminChatId,
    maxOpsPerBot: maxOps,
  });

  return config;
});

function parseChannelConfigs(): TelegramChannelConfig[] {
  const channelConfigs: TelegramChannelConfig[] = [];

  // Get all environment variables
  const envVars = Object.keys(process.env);

  // Find all channel config variables (they can be in any order)
  const channelConfigVars = envVars.filter((key) =>
    key.startsWith('TELEGRAM_CHANNEL_CONFIG_'),
  );

  for (const configVar of channelConfigVars) {
    const channelConfig = process.env[configVar];
    if (!channelConfig) continue;

    const [channelId, description, botTokensStr] = channelConfig.split('::');
    if (!channelId || !botTokensStr) {
      console.warn(`Invalid channel configuration format in ${configVar}`);
      continue;
    }

    channelConfigs.push({
      channelId: channelId.trim(),
      description: description?.trim(),
      botTokens: botTokensStr
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean),
    });
  }

  return channelConfigs;
}
