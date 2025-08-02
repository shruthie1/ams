import { registerAs } from '@nestjs/config';

export interface tgBotConfig {
  token: string;
  maxConcurrentOperations: number;
}

export interface tgChannelConfig {
  channelId: string;
  description?: string;
  botTokens: string[]; // List of bot tokens that can forward to this channel
}

export interface tgConfig {
  bots: tgBotConfig[];
  channels: tgChannelConfig[];
  adminChatId?: string;
}

export class BotUtils {
  private static config: tgConfig;

  static initialize(config: tgConfig) {
    this.config = config;
  }

  static getChannelById(channelId: string): tgChannelConfig | undefined {
    return this.config?.channels.find(
      (channel) => channel.channelId === channelId,
    );
  }

  static getChannelsByBotToken(botToken: string): tgChannelConfig[] {
    return this.config?.channels.filter((channel) =>
      channel.botTokens.includes(botToken),
    ) || [];
  }

  static canBotAccessChannel(botToken: string, channelId: string): boolean {
    const channel = this.getChannelById(channelId);
    return channel ? channel.botTokens.includes(botToken) : false;
  }

  static getBotsForChannel(channelId: string): tgBotConfig[] {
    const channel = this.getChannelById(channelId);
    if (!channel) return [];

    return this.config?.bots.filter((bot) =>
      channel.botTokens.includes(bot.token),
    ) || [];
  }

  static getAllChannels(): tgChannelConfig[] {
    return this.config?.channels || [];
  }

  static getAllBots(): tgBotConfig[] {
    return this.config?.bots || [];
  }

  static getAdminChatId(): string | undefined {
    return this.config?.adminChatId;
  }
}

export default registerAs('bot', () => {
  const maxOps = parseInt(process.env.bot_BOT_MAX_OPERATIONS || '10');
  const adminChatId = process.env.bot_ADMIN_CHAT_ID;
  // Parse channel configurations from environment variables
  const channelConfigs = parseChannelConfigs();

  if (!channelConfigs.length) {
    console.warn('No bot channel configurations found!');
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
    console.warn('No bot bot tokens found in channel configurations!');
  }

  const config: tgConfig = {
    bots: Array.from(uniqueBotTokens).map((token) => ({
      token: token.trim(),
      maxConcurrentOperations: maxOps,
    })),
    channels: channelConfigs,
    adminChatId,
  };

  // Initialize the BotUtils with the config
  BotUtils.initialize(config);

  console.log('Loaded bot configuration:', {
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

function parseChannelConfigs(): tgChannelConfig[] {
  const channelConfigs: tgChannelConfig[] = [];

  // Get all environment variables
  const envVars = Object.keys(process.env);

  // Find all channel config variables (they can be in any order)
  const channelConfigVars = envVars.filter((key) =>
    key.startsWith('TELEGRAM_CHANNEL_'),
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
