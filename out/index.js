/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bot/bot.load-balancer.ts":
/*!**************************************!*\
  !*** ./src/Bot/bot.load-balancer.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var botLoadBalancer_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.botLoadBalancer = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const node_telegram_bot_api_1 = __importDefault(__webpack_require__(/*! node-telegram-bot-api */ "node-telegram-bot-api"));
let botLoadBalancer = botLoadBalancer_1 = class botLoadBalancer {
    constructor() {
        this.bots = [];
        this.logger = new common_1.Logger(botLoadBalancer_1.name);
    }
    getBotOperationCount(bot) {
        const botInfo = this.bots.find((b) => b.bot === bot);
        return botInfo?.operationCount || 0;
    }
    getBotMaxOperations(bot) {
        const botInfo = this.bots.find((b) => b.bot === bot);
        return botInfo?.config.maxConcurrentOperations || 0;
    }
    getBotUtilizationPercentage(bot) {
        const maxOps = this.getBotMaxOperations(bot);
        if (!maxOps)
            return 0;
        return (this.getBotOperationCount(bot) / maxOps) * 100;
    }
    addBot(config) {
        const bot = new node_telegram_bot_api_1.default(config.token, { polling: true });
        this.bots.push({
            bot,
            operationCount: 0,
            config,
        });
        this.logger.log(`Added new bot to the pool. Total bots: ${this.bots.length}`);
    }
    getNextBot() {
        if (!this.bots.length) {
            throw new Error('No bots available in the pool');
        }
        const selectedBot = this.bots.reduce((prev, curr) => {
            return prev.operationCount <= curr.operationCount ? prev : curr;
        });
        if (selectedBot.operationCount >= selectedBot.config.maxConcurrentOperations) {
        }
        selectedBot.operationCount++;
        return selectedBot.bot;
    }
    releaseBot(bot) {
        const botInfo = this.bots.find((b) => b.bot === bot);
        if (botInfo) {
            botInfo.operationCount = Math.max(0, botInfo.operationCount - 1);
        }
    }
    getAllBots() {
        return this.bots.map((b) => b.bot);
    }
    getBotToken(bot) {
        const botInfo = this.bots.find((b) => b.bot === bot);
        return botInfo?.config.token;
    }
    getBotByToken(token) {
        for (const botInfo of this.bots) {
            if (botInfo.config.token === token) {
                return botInfo.bot;
            }
        }
        return undefined;
    }
    getBots() {
        return this.bots;
    }
};
exports.botLoadBalancer = botLoadBalancer;
exports.botLoadBalancer = botLoadBalancer = botLoadBalancer_1 = __decorate([
    (0, common_1.Injectable)()
], botLoadBalancer);


/***/ }),

/***/ "./src/Bot/bot.module.ts":
/*!*******************************!*\
  !*** ./src/Bot/bot.module.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.botModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const bot_service_1 = __webpack_require__(/*! ./bot.service */ "./src/Bot/bot.service.ts");
const bot_load_balancer_1 = __webpack_require__(/*! ./bot.load-balancer */ "./src/Bot/bot.load-balancer.ts");
let botModule = class botModule {
};
exports.botModule = botModule;
exports.botModule = botModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [bot_service_1.botService, bot_load_balancer_1.botLoadBalancer],
        exports: [bot_service_1.botService],
    })
], botModule);


/***/ }),

/***/ "./src/Bot/bot.service.ts":
/*!********************************!*\
  !*** ./src/Bot/bot.service.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var botService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.botService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const bot_load_balancer_1 = __webpack_require__(/*! ./bot.load-balancer */ "./src/Bot/bot.load-balancer.ts");
const bot_dto_1 = __webpack_require__(/*! ./dto/bot.dto */ "./src/Bot/dto/bot.dto.ts");
let botService = botService_1 = class botService {
    constructor(configService, loadBalancer) {
        this.configService = configService;
        this.loadBalancer = loadBalancer;
        this.logger = new common_1.Logger(botService_1.name);
        this.MAX_RETRIES = 3;
        this.RETRY_DELAY = 1000;
        this.messageQueue = new Map();
        this.config = this.configService.get('bot');
    }
    async onModuleInit() {
        this.logger.log('Initializing bot service...');
        await this.initializeBots();
        this.startMessageQueueProcessor();
        this.logger.log('bot service initialized successfully');
    }
    async initializeBots() {
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
            }
            catch (error) {
                this.logger.error(`Failed to initialize bot with token ${botConfig.token.slice(0, 6)}...`, error.stack);
                this.queueBotRecovery(botConfig);
            }
        });
        await Promise.allSettled(initPromises);
    }
    queueBotRecovery(botConfig) {
        this.logger.debug(`Queuing recovery for bot with token ${botConfig.token.slice(0, 6)}...`);
        setTimeout(() => {
            try {
                this.loadBalancer.addBot(botConfig);
                const bot = this.loadBalancer.getBotByToken(botConfig.token);
                if (bot) {
                    this.setupMessageHandlers(bot);
                    this.logger.log(`Successfully recovered bot with token ${botConfig.token.slice(0, 6)}...`);
                }
            }
            catch (error) {
                this.logger.error(`Failed to recover bot with token ${botConfig.token.slice(0, 6)}...`, error.stack);
                this.logger.warn(`Bot recovery failed, retrying... Token: ${botConfig.token.slice(0, 6)}...`);
                this.queueBotRecovery(botConfig);
            }
        }, this.RETRY_DELAY);
    }
    startMessageQueueProcessor() {
        this.logger.log('Starting message queue processor');
        setInterval(() => this.processMessageQueue(), 1000);
    }
    async processMessageQueue() {
        if (this.messageQueue.size === 0)
            return;
        this.logger.debug(`Processing message queue. Size: ${this.messageQueue.size}`);
        for (const [messageId, queueItem] of this.messageQueue) {
            const bot = this.loadBalancer.getNextBot();
            try {
                await this.forwardMessage(bot, queueItem.message, queueItem.channelId);
                this.messageQueue.delete(messageId);
                this.logger.debug(`Successfully processed queued message ${messageId}`);
            }
            catch (error) {
                if (queueItem.retries >= this.MAX_RETRIES) {
                    this.messageQueue.delete(messageId);
                    this.logger.error(`Failed to forward message ${messageId} after ${this.MAX_RETRIES} ${(await bot.getMe()).username} retries:`, error.stack);
                    this.notifyAdmin(`Failed to forward message after ${this.MAX_RETRIES} retries: ${error.message}`);
                }
                else {
                    queueItem.retries++;
                    this.logger.warn(`Retry ${queueItem.retries}/${this.MAX_RETRIES} for message ${messageId}`);
                }
            }
        }
    }
    setupMessageHandlers(bot) {
        bot.on('message', (msg) => {
            this.handleIncomingMessage(bot, msg).catch((error) => this.handleMessageError(error, msg, bot));
        });
        bot.on('error', (error) => {
            this.notifyAdmin(`Bot error occurred: ${error.message}`);
        });
    }
    async handleMessageError(error, message, bot) {
        const messageId = `${message.chat.id}-${message.message_id}`;
        const botToken = this.loadBalancer.getBotToken(bot);
        const matchingChannel = this.config.channels.find((channel) => channel.botTokens.includes(botToken));
        if (!this.messageQueue.has(messageId)) {
            this.messageQueue.set(messageId, {
                retries: 0,
                message,
                channelId: matchingChannel?.channelId,
            });
        }
        await this.notifyAdmin(`Message queued for retry: ${error.message}`);
    }
    async notifyAdmin(message) {
        if (!this.config.adminChatId)
            return;
        try {
            const bot = this.loadBalancer.getNextBot();
            await bot.sendMessage(this.config.adminChatId, message);
        }
        catch {
        }
    }
    async handleIncomingMessage(bot, message) {
        const messageId = `${message.chat.id}-${message.message_id}`;
        if (message.text?.toLowerCase().startsWith('start')) {
            this.logger.debug(`Skipping start command message ${messageId}`);
            return;
        }
        const botToken = this.loadBalancer.getBotToken(bot);
        const matchingChannel = this.config.channels.find((channel) => channel.botTokens.includes(botToken));
        if (!matchingChannel) {
            this.logger.warn(`No channel configured for bot token: ${botToken.slice(0, 6)}...`);
            await this.notifyAdmin(`⚠️ Configuration issue: No channel configured for bot token: ${botToken.slice(0, 6)}...`);
            return;
        }
        try {
            await this.forwardMessageWithRetry(bot, message, matchingChannel.channelId);
            await this.notifyAdmin(`Message forwarded to channel ${matchingChannel.channelId}`);
        }
        catch (error) {
            this.logger.warn(`Failed to forward message ${messageId}, queueing for retry: ${error.message}`);
            this.messageQueue.set(messageId, {
                retries: 0,
                message,
                channelId: matchingChannel.channelId,
            });
            await this.notifyAdmin(`Message queued for retry: ${error.message}`);
        }
    }
    async forwardMessageWithRetry(bot, message, channelId, retryCount = 0) {
        const messageId = `${message.chat.id}-${message.message_id}`;
        try {
            await this.forwardMessage(bot, message, channelId);
        }
        catch (error) {
            if (retryCount < this.MAX_RETRIES) {
                this.logger.debug(`Retry attempt ${retryCount + 1} failed, switching to next bot`);
                await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
                const nextBot = this.loadBalancer.getNextBot();
                return this.forwardMessageWithRetry(nextBot, message, channelId, retryCount + 1);
            }
            this.logger.error(`All retry attempts failed for message ${messageId}`);
            throw error;
        }
    }
    async forwardMessage(bot, message, channelId) {
        const messageId = `${message.chat.id}-${message.message_id}`;
        try {
            await bot.forwardMessage(channelId, message.chat.id, message.message_id);
            this.logger.debug(`Message ${messageId} forwarded successfully`);
        }
        catch (error) {
            this.logger.error(`Failed to forward message ${messageId} using bot... ${(await bot.getMe()).username}, Text: ${message.text}, Channel: ${channelId}`, error.stack);
            this.logger.debug(`Forward attempt failed, trying fallback bot for message ${messageId}`);
            const fallbackBot = this.loadBalancer.getNextBot();
            if (fallbackBot === bot) {
                this.logger.error(`No available bots for forwarding message ${messageId}`);
                throw new Error('No available bots for forwarding');
            }
            await fallbackBot.forwardMessage(channelId, message.chat.id, message.message_id);
            this.logger.debug(`Message ${messageId} forwarded successfully using fallback bot`);
        }
    }
    async broadcastMessage(messageDto) {
        this.logger.debug('Starting broadcast message operation');
        try {
            const bot = this.loadBalancer.getNextBot();
            const channel = this.config.channels[0];
            const result = await this.sendMessageByType(bot, channel.channelId, messageDto);
            this.logger.log(`Successfully broadcasted message with ID: ${result.message_id}`);
            return {
                success: true,
                messageId: result.message_id.toString(),
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Failed to broadcast message:', error.stack);
            return {
                success: false,
                timestamp: new Date().toISOString(),
            };
        }
    }
    async sendMessageByType(bot, channelId, messageDto) {
        this.logger.debug(`Sending ${messageDto.type} message to channel ${channelId}`);
        switch (messageDto.type) {
            case bot_dto_1.MessageType.PHOTO:
                if (!messageDto.mediaUrl) {
                    this.logger.error('Media URL is required for photo messages');
                    throw new Error('Media URL is required for photo messages');
                }
                return bot.sendPhoto(channelId, messageDto.mediaUrl, {
                    caption: messageDto.message,
                });
            case bot_dto_1.MessageType.VIDEO:
                if (!messageDto.mediaUrl) {
                    this.logger.error('Media URL is required for video messages');
                    throw new Error('Media URL is required for video messages');
                }
                return bot.sendVideo(channelId, messageDto.mediaUrl, {
                    caption: messageDto.message,
                });
            case bot_dto_1.MessageType.TEXT:
            default:
                return bot.sendMessage(channelId, messageDto.message);
        }
    }
    async getBotStatus() {
        this.logger.debug('Fetching bot status information');
        const bots = this.loadBalancer.getBots() || [];
        return bots.map((botInfo, index) => {
            const operations = this.loadBalancer.getBotOperationCount(botInfo.bot);
            const maxOps = this.loadBalancer.getBotMaxOperations(botInfo.bot);
            return {
                id: index + 1,
                activeOperations: operations,
                maxOperations: maxOps,
                utilizationPercentage: this.loadBalancer.getBotUtilizationPercentage(botInfo.bot),
            };
        });
    }
    async getConfiguration() {
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
};
exports.botService = botService;
exports.botService = botService = botService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        bot_load_balancer_1.botLoadBalancer])
], botService);


/***/ }),

/***/ "./src/Bot/dto/bot.dto.ts":
/*!********************************!*\
  !*** ./src/Bot/dto/bot.dto.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BroadcastResponseDto = exports.ConfigurationResponseDto = exports.BotStatusResponseDto = exports.BroadcastMessageDto = exports.MessageType = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
var MessageType;
(function (MessageType) {
    MessageType["TEXT"] = "text";
    MessageType["PHOTO"] = "photo";
    MessageType["VIDEO"] = "video";
})(MessageType || (exports.MessageType = MessageType = {}));
class BroadcastMessageDto {
    constructor() {
        this.type = MessageType.TEXT;
    }
}
exports.BroadcastMessageDto = BroadcastMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message text or caption for media',
        example: 'Hello everyone! Check out this photo.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: MessageType,
        default: MessageType.TEXT,
        description: 'Type of message to broadcast',
    }),
    (0, class_validator_1.IsEnum)(MessageType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL of the media to be sent (required for photo/video types)',
        example: 'https://example.com/image.jpg',
    }),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BroadcastMessageDto.prototype, "mediaUrl", void 0);
class BotStatusResponseDto {
}
exports.BotStatusResponseDto = BotStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the bot',
        example: 1,
    }),
    __metadata("design:type", Number)
], BotStatusResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of current active operations',
        example: 5,
    }),
    __metadata("design:type", Number)
], BotStatusResponseDto.prototype, "activeOperations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum allowed concurrent operations',
        example: 10,
    }),
    __metadata("design:type", Number)
], BotStatusResponseDto.prototype, "maxOperations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current utilization percentage',
        example: 50,
    }),
    __metadata("design:type", Number)
], BotStatusResponseDto.prototype, "utilizationPercentage", void 0);
class ConfigurationResponseDto {
}
exports.ConfigurationResponseDto = ConfigurationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of allowed media types',
        example: ['photo', 'video'],
        isArray: true,
    }),
    (0, swagger_1.ApiProperty)({
        description: 'Whether the target channel is properly configured',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ConfigurationResponseDto.prototype, "channelConfigured", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of configured bots',
        example: 3,
    }),
    __metadata("design:type", Number)
], ConfigurationResponseDto.prototype, "botsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum concurrent operations allowed per bot',
        example: 10,
    }),
    __metadata("design:type", Number)
], ConfigurationResponseDto.prototype, "maxOperationsPerBot", void 0);
class BroadcastResponseDto {
}
exports.BroadcastResponseDto = BroadcastResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the broadcast was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], BroadcastResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Message ID in the channel (if available)',
        example: '12345',
        required: false,
    }),
    __metadata("design:type", String)
], BroadcastResponseDto.prototype, "messageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Timestamp of the broadcast',
        example: '2025-05-01T12:00:00Z',
    }),
    __metadata("design:type", String)
], BroadcastResponseDto.prototype, "timestamp", void 0);


/***/ }),

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The service is up and running',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Health Check'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const file_module_1 = __webpack_require__(/*! ./files/file.module */ "./src/files/file.module.ts");
const bot_module_1 = __webpack_require__(/*! ./Bot/bot.module */ "./src/Bot/bot.module.ts");
const bot_config_1 = __importDefault(__webpack_require__(/*! ./config/bot.config */ "./src/config/bot.config.ts"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [bot_config_1.default],
            }),
            file_module_1.FileModule.register(),
            bot_module_1.botModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),

/***/ "./src/config/bot.config.ts":
/*!**********************************!*\
  !*** ./src/config/bot.config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BotUtils = void 0;
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
class BotUtils {
    static initialize(config) {
        this.config = config;
    }
    static getChannelById(channelId) {
        return this.config?.channels.find((channel) => channel.channelId === channelId);
    }
    static getChannelsByBotToken(botToken) {
        return this.config?.channels.filter((channel) => channel.botTokens.includes(botToken)) || [];
    }
    static canBotAccessChannel(botToken, channelId) {
        const channel = this.getChannelById(channelId);
        return channel ? channel.botTokens.includes(botToken) : false;
    }
    static getBotsForChannel(channelId) {
        const channel = this.getChannelById(channelId);
        if (!channel)
            return [];
        return this.config?.bots.filter((bot) => channel.botTokens.includes(bot.token)) || [];
    }
    static getAllChannels() {
        return this.config?.channels || [];
    }
    static getAllBots() {
        return this.config?.bots || [];
    }
    static getAdminChatId() {
        return this.config?.adminChatId;
    }
}
exports.BotUtils = BotUtils;
exports["default"] = (0, config_1.registerAs)('bot', () => {
    const maxOps = parseInt(process.env.bot_BOT_MAX_OPERATIONS || '10');
    const adminChatId = process.env.bot_ADMIN_CHAT_ID;
    const channelConfigs = parseChannelConfigs();
    if (!channelConfigs.length) {
        console.warn('No bot channel configurations found!');
    }
    else {
        console.log('Parsed channel configurations:', channelConfigs.map((channel) => ({
            channelId: channel.channelId,
            description: channel.description || 'no description',
            botCount: channel.botTokens.length,
        })));
    }
    const uniqueBotTokens = new Set();
    const botChannelMapping = new Map();
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
    const config = {
        bots: Array.from(uniqueBotTokens).map((token) => ({
            token: token.trim(),
            maxConcurrentOperations: maxOps,
        })),
        channels: channelConfigs,
        adminChatId,
    };
    BotUtils.initialize(config);
    console.log('Loaded bot configuration:', {
        botsCount: config.bots.length,
        channelsCount: config.channels.length,
        botMappings: Array.from(botChannelMapping.entries()).map(([token, channels]) => ({
            botToken: `${token.slice(0, 6)}...`,
            channels,
        })),
        hasAdminChatId: !!config.adminChatId,
        maxOpsPerBot: maxOps,
    });
    return config;
});
function parseChannelConfigs() {
    const channelConfigs = [];
    const envVars = Object.keys(process.env);
    const channelConfigVars = envVars.filter((key) => key.startsWith('TELEGRAM_CHANNEL_'));
    for (const configVar of channelConfigVars) {
        const channelConfig = process.env[configVar];
        if (!channelConfig)
            continue;
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


/***/ }),

/***/ "./src/config/swagger.config.ts":
/*!**************************************!*\
  !*** ./src/config/swagger.config.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupSwagger = setupSwagger;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
function setupSwagger(app) {
    console.log('Setting up Swagger documentation...');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('File Storage API')
        .setDescription('API for managing files and folders in the Asset Management System')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    console.log('Generated Swagger document');
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
    swagger_1.SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
            syntaxHighlight: {
                theme: 'monokai',
            },
            tryItOutEnabled: true,
            displayRequestDuration: true,
        },
        customSiteTitle: 'File Storage API Documentation',
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info { margin: 20px 0 }
            .swagger-ui .info .title { color: #2c3e50 }
            .swagger-ui .info__contact { padding: 1rem 0 }
            .swagger-ui .markdown p { margin: 1em 0 }
            .swagger-ui .btn.execute { background-color: #2c3e50 }
            .swagger-ui .btn.execute:hover { background-color: #34495e }
        `,
        customfavIcon: 'https://nestjs.com/favicon.ico',
    });
}


/***/ }),

/***/ "./src/files/config/file.config.ts":
/*!*****************************************!*\
  !*** ./src/files/config/file.config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FILE_CONFIG = void 0;
const path_1 = __webpack_require__(/*! path */ "path");
exports.FILE_CONFIG = {
    MAX_FILE_SIZE: 1024 * 1024 * 100,
    MAX_FILES_PER_UPLOAD: 10,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    TEMP_LINK_EXPIRY: 24 * 60 * 60 * 1000,
    STORAGE_PATH: (0, path_1.join)(process.cwd(), 'uploads'),
};


/***/ }),

/***/ "./src/files/config/view.config.ts":
/*!*****************************************!*\
  !*** ./src/files/config/view.config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VIEW_CONFIG = void 0;
exports.VIEW_CONFIG = {
    IMAGE_TYPES: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
    ],
    PDF_TYPES: ['application/pdf'],
    TEXT_TYPES: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml',
    ],
    AUDIO_TYPES: [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp3',
        'audio/aac',
        'audio/webm',
    ],
    VIDEO_TYPES: [
        'video/mp4',
        'video/mpeg',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
    ],
    PREVIEW_SIZE_LIMIT: 1024 * 1024 * 100,
    THUMBNAIL_OPTIONS: {
        width: 320,
        height: 240,
        quality: 85,
        format: 'jpeg',
        fit: 'contain',
        background: {
            r: 245,
            g: 245,
            b: 245,
            alpha: 1,
        },
    },
    DEFAULT_THUMBNAILS: {
        video: 'assets/video-thumbnail.png',
        audio: 'assets/audio-thumbnail.png',
    },
    VIDEO_PREVIEW: {
        thumbnailTime: '00:00:01',
        width: 320,
        height: 240,
    },
    AUDIO_PREVIEW: {
        duration: true,
        metadata: true,
        waveform: true,
    },
    VIDEO_THUMBNAIL: {
        timePosition: '00:00:01',
        frameCount: 1,
    },
    THUMBNAIL_STYLES: {
        background: {
            startColor: '#1a73e8',
            endColor: '#174ea6',
        },
        text: {
            color: '#ffffff',
            fontFamily: 'Arial',
            fontSize: {
                title: 12,
                format: 11,
            },
        },
        playButton: {
            size: 40,
            color: '#1a73e8',
            background: '#ffffff',
        },
    },
};


/***/ }),

/***/ "./src/files/dto/requests.dto.ts":
/*!***************************************!*\
  !*** ./src/files/dto/requests.dto.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CopyFolderDto = exports.JsonQuery = exports.JsonPathParams = exports.UpdateFileMetadataDto = exports.CopyFileDto = exports.RenameFolderDto = exports.MoveFolderDto = exports.MoveFileDto = exports.CreateFolderDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateFolderDto {
}
exports.CreateFolderDto = CreateFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'documents',
        description: 'Name of the folder to create',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateFolderDto.prototype, "folderName", void 0);
class MoveFileDto {
}
exports.MoveFileDto = MoveFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'destination',
        description: 'New folder path for the file',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MoveFileDto.prototype, "newFolder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newname.pdf', description: 'New name for the file' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MoveFileDto.prototype, "newFilename", void 0);
class MoveFolderDto {
}
exports.MoveFolderDto = MoveFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'new-location',
        description: 'New location path for the folder',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MoveFolderDto.prototype, "newLocation", void 0);
class RenameFolderDto {
}
exports.RenameFolderDto = RenameFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'new-folder-name',
        description: 'New name for the folder',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RenameFolderDto.prototype, "newFolderName", void 0);
class CopyFileDto {
}
exports.CopyFileDto = CopyFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'destination',
        description: 'Destination folder for the file copy',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CopyFileDto.prototype, "newFolder", void 0);
class UpdateFileMetadataDto {
}
exports.UpdateFileMetadataDto = UpdateFileMetadataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newname.pdf', description: 'New name for the file' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFileMetadataDto.prototype, "newFilename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'new-folder',
        description: 'New folder for the file',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateFileMetadataDto.prototype, "newFolder", void 0);
class JsonPathParams {
}
exports.JsonPathParams = JsonPathParams;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['user', 'profile', 'name'],
        description: 'Path segments to the nested value',
        isArray: true,
    }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    __metadata("design:type", Array)
], JsonPathParams.prototype, "path", void 0);
class JsonQuery {
}
exports.JsonQuery = JsonQuery;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'data.users[0].name',
        description: 'JSON path query using dot notation',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], JsonQuery.prototype, "query", void 0);
class CopyFolderDto {
}
exports.CopyFolderDto = CopyFolderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'destination-folder',
        description: 'Destination folder for the folder copy',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CopyFolderDto.prototype, "destinationFolder", void 0);


/***/ }),

/***/ "./src/files/dto/responses.dto.ts":
/*!****************************************!*\
  !*** ./src/files/dto/responses.dto.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileOperationMetricsResponse = exports.FileOperationMetricDto = exports.JsonValueResponse = exports.JsonFileResponse = exports.ErrorResponse = exports.FolderTreeResponse = exports.FileVersionResponse = exports.ShareableLinkResponse = exports.FolderDetailsResponse = exports.FolderResponse = exports.FileMetadataResponse = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class FileMetadataResponse {
}
exports.FileMetadataResponse = FileMetadataResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'document.pdf', description: 'Name of the file' }),
    __metadata("design:type", String)
], FileMetadataResponse.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1024, description: 'Size of file in bytes' }),
    __metadata("design:type", Number)
], FileMetadataResponse.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-02-20T10:00:00.000Z',
        description: 'Creation timestamp',
    }),
    __metadata("design:type", Date)
], FileMetadataResponse.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-02-20T11:30:00.000Z',
        description: 'Last modification timestamp',
    }),
    __metadata("design:type", Date)
], FileMetadataResponse.prototype, "modifiedAt", void 0);
class FolderResponse {
}
exports.FolderResponse = FolderResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['folder1', 'folder2'],
        description: 'List of folder names',
    }),
    __metadata("design:type", Array)
], FolderResponse.prototype, "folders", void 0);
class FolderDetailsResponse {
}
exports.FolderDetailsResponse = FolderDetailsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'documents', description: 'Name of the folder' }),
    __metadata("design:type", String)
], FolderDetailsResponse.prototype, "folder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['file1.pdf', 'file2.jpg'],
        description: 'List of files in the folder',
    }),
    __metadata("design:type", Array)
], FolderDetailsResponse.prototype, "files", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Total number of files in folder' }),
    __metadata("design:type", Number)
], FolderDetailsResponse.prototype, "totalFiles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Current page number' }),
    __metadata("design:type", Number)
], FolderDetailsResponse.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Number of items per page' }),
    __metadata("design:type", Number)
], FolderDetailsResponse.prototype, "limit", void 0);
class ShareableLinkResponse {
}
exports.ShareableLinkResponse = ShareableLinkResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://promoteClients2.glitch.me/folders/docs/files/example.pdf?share=true',
        description: 'Generated shareable link for the file',
    }),
    __metadata("design:type", String)
], ShareableLinkResponse.prototype, "shareableLink", void 0);
class FileVersionResponse {
}
exports.FileVersionResponse = FileVersionResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'document.pdf',
        description: 'Name of the original file',
    }),
    __metadata("design:type", String)
], FileVersionResponse.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            { version: '1', filename: 'document.pdf.v1' },
            { version: '2', filename: 'document.pdf.v2' },
        ],
        description: 'List of available versions',
    }),
    __metadata("design:type", Array)
], FileVersionResponse.prototype, "versions", void 0);
class FolderTreeResponse {
}
exports.FolderTreeResponse = FolderTreeResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'root', description: 'Name of the current node' }),
    __metadata("design:type", String)
], FolderTreeResponse.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ name: 'folder1', children: [] }, { name: 'file1.pdf' }],
        description: 'Child nodes (folders and files)',
    }),
    __metadata("design:type", Array)
], FolderTreeResponse.prototype, "children", void 0);
class ErrorResponse {
}
exports.ErrorResponse = ErrorResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 400, description: 'HTTP status code' }),
    __metadata("design:type", Number)
], ErrorResponse.prototype, "statusCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'File not found', description: 'Error message' }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bad Request', description: 'Error type' }),
    __metadata("design:type", String)
], ErrorResponse.prototype, "error", void 0);
class JsonFileResponse {
}
exports.JsonFileResponse = JsonFileResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            key: 'value',
            name: 'example',
            age: 30,
            nested: {
                key: 'value',
            },
        },
        description: 'JSON file content',
    }),
    __metadata("design:type", Object)
], JsonFileResponse.prototype, "content", void 0);
class JsonValueResponse {
}
exports.JsonValueResponse = JsonValueResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'value',
        description: 'Value at the specified path in the JSON file',
    }),
    __metadata("design:type", Object)
], JsonValueResponse.prototype, "value", void 0);
class FileOperationMetricDto {
}
exports.FileOperationMetricDto = FileOperationMetricDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'createFolder',
        description: 'Name of the file operation',
    }),
    __metadata("design:type", String)
], FileOperationMetricDto.prototype, "operation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether the operation succeeded',
    }),
    __metadata("design:type", Boolean)
], FileOperationMetricDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 123,
        description: 'Duration of operation in milliseconds',
    }),
    __metadata("design:type", Number)
], FileOperationMetricDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1645564789123,
        description: 'Timestamp of the operation',
    }),
    __metadata("design:type", Number)
], FileOperationMetricDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '/uploads/docs',
        required: false,
        description: 'Path involved in the operation',
    }),
    __metadata("design:type", String)
], FileOperationMetricDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Error message if operation failed',
    }),
    __metadata("design:type", String)
], FileOperationMetricDto.prototype, "error", void 0);
class FileOperationMetricsResponse {
}
exports.FileOperationMetricsResponse = FileOperationMetricsResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [FileOperationMetricDto],
        description: 'Recent file operation metrics',
    }),
    __metadata("design:type", Array)
], FileOperationMetricsResponse.prototype, "metrics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 0.05,
        description: 'Rate of failed operations in the time window',
    }),
    __metadata("design:type", Number)
], FileOperationMetricsResponse.prototype, "failureRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600000, description: 'Time window in milliseconds' }),
    __metadata("design:type", Number)
], FileOperationMetricsResponse.prototype, "timeWindow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Total number of operations recorded',
    }),
    __metadata("design:type", Number)
], FileOperationMetricsResponse.prototype, "totalOperations", void 0);


/***/ }),

/***/ "./src/files/file.controller.ts":
/*!**************************************!*\
  !*** ./src/files/file.controller.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FileController_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const multer_1 = __webpack_require__(/*! multer */ "multer");
const file_validators_1 = __webpack_require__(/*! ./utils/file-validators */ "./src/files/utils/file-validators.ts");
const file_config_1 = __webpack_require__(/*! ./config/file.config */ "./src/files/config/file.config.ts");
const file_service_1 = __webpack_require__(/*! ./file.service */ "./src/files/file.service.ts");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const path_1 = __webpack_require__(/*! path */ "path");
const requests_dto_1 = __webpack_require__(/*! ./dto/requests.dto */ "./src/files/dto/requests.dto.ts");
const responses_dto_1 = __webpack_require__(/*! ./dto/responses.dto */ "./src/files/dto/responses.dto.ts");
const requests_dto_2 = __webpack_require__(/*! ./dto/requests.dto */ "./src/files/dto/requests.dto.ts");
const file_operation_monitor_1 = __webpack_require__(/*! ./utils/file-operation-monitor */ "./src/files/utils/file-operation-monitor.ts");
const MAX_FILE_SIZE = 1024 * 1024 * 100;
const UPLOADS_BASE = (0, path_1.join)(process.cwd(), 'uploads');
function getSafePath(...segments) {
    const filePath = (0, path_1.join)(...segments);
    const resolvedPath = (0, path_1.resolve)(filePath);
    const uploadsPath = (0, path_1.resolve)(UPLOADS_BASE);
    if (!resolvedPath.startsWith(uploadsPath)) {
        throw new Error(`Invalid path detected: ${resolvedPath}`);
    }
    return filePath;
}
let FileController = FileController_1 = class FileController {
    constructor(fileService) {
        this.logger = new common_1.Logger(FileController_1.name);
        if (!fileService) {
            throw new Error('FileService is required');
        }
        this.fileService = fileService;
    }
    async uploadFiles(folder, files) {
        if (!files?.length) {
            throw new common_1.BadRequestException('No files provided');
        }
        return this.fileService.uploadFiles(folder, files);
    }
    listFolders() {
        return this.fileService.listFolders();
    }
    getFolderDetails(folder, page, limit) {
        return this.fileService.getFolderDetails(folder, page, limit);
    }
    createFolder(createFolderDto) {
        return this.fileService.createFolder(createFolderDto.folderName);
    }
    deleteFolder(folder) {
        return this.fileService.deleteFolder(folder);
    }
    downloadFile(folder, filename, res) {
        return this.fileService.downloadFile(folder, filename, res);
    }
    getFileMetadata(folder, filename) {
        return this.fileService.getFileMetadata(folder, filename);
    }
    moveFile(folder, filename, moveFileDto) {
        return this.fileService.moveFile(folder, filename, moveFileDto);
    }
    copyFile(folder, filename, copyFileDto) {
        return this.fileService.copyFile(folder, filename, copyFileDto);
    }
    async downloadAllFiles(folder, res) {
        return this.fileService.downloadAllFiles(folder, res);
    }
    getTemporaryLinks(folder) {
        return this.fileService.getTemporaryLinks(folder);
    }
    getTemporaryFileLink(folder, filename) {
        return this.fileService.getTemporaryFileLink(folder, filename);
    }
    searchFiles(folder, pattern) {
        return this.fileService.searchFiles(folder, pattern);
    }
    getJsonFile(folder, filename) {
        return this.fileService.getJsonFile(folder, filename);
    }
    getNestedJsonValue(folder, filename, pathParams) {
        return this.fileService.getNestedJsonValue(folder, filename, pathParams);
    }
    queryJsonFile(folder, filename, query) {
        return this.fileService.queryJsonFile(folder, filename, query);
    }
    deleteFile(folder, filename) {
        return this.fileService.deleteFile(folder, filename);
    }
    updateFileMetadata(folder, filename, updateFileMetadataDto) {
        return this.fileService.updateFileMetadata(folder, filename, updateFileMetadataDto);
    }
    getFolderSize(folder) {
        return this.fileService.getFolderSize(folder);
    }
    listFiles(folder) {
        return this.fileService.listFiles(folder);
    }
    getThumbnail(folder, filename, res) {
        return this.fileService.getThumbnail(folder, filename, res);
    }
    getFile(folder, filename, res) {
        return this.fileService.getFile(folder, filename, res);
    }
    renameFolder(folder, renameFolderDto) {
        return this.fileService.renameFolder(folder, renameFolderDto.newFolderName);
    }
    moveFolder(folder, moveFolderDto) {
        return this.fileService.moveFolder(folder, moveFolderDto.newLocation);
    }
    getFilePreview(folder, filename, req, res) {
        return this.fileService.getFilePreview(folder, filename, req, res);
    }
    getFolderTree() {
        return this.fileService.getFolderTree();
    }
    generateShareableLink(folder, filename) {
        return this.fileService.generateShareableLink(folder, filename);
    }
    lockFile(folder, filename) {
        return this.fileService.lockFile(folder, filename);
    }
    unlockFile(folder, filename) {
        return this.fileService.unlockFile(folder, filename);
    }
    getRecentFiles() {
        return this.fileService.getRecentFiles();
    }
    getFileVersions(folder, filename) {
        return this.fileService.getFileVersions(folder, filename);
    }
    getFileOperationMetrics(timeWindow, limit) {
        const metrics = file_operation_monitor_1.FileOperationMonitor.getMetrics(limit);
        const failureRate = file_operation_monitor_1.FileOperationMonitor.getFailureRate(timeWindow);
        return {
            metrics,
            failureRate,
            timeWindow,
            totalOperations: metrics.length,
        };
    }
    async copyFolder(folder, destinationFolder) {
        return this.fileService.copyFolder(folder, destinationFolder);
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)('folders/:folder/files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                try {
                    const folderName = req.params.folder;
                    const folderPath = getSafePath(UPLOADS_BASE, folderName);
                    if (!(0, fs_1.existsSync)(folderPath)) {
                        (0, fs_1.mkdirSync)(folderPath, { recursive: true });
                        console.log(`Created folder: ${folderPath}`);
                    }
                    cb(null, folderPath);
                }
                catch (error) {
                    console.error(`Error setting destination: ${error.message}`);
                    cb(error, null);
                }
            },
            filename: (req, file, cb) => {
                try {
                    const filenameQuery = req.query.filename;
                    const { originalname } = file;
                    const extension = originalname.substring(originalname.lastIndexOf('.'));
                    if (!req.fileCounter) {
                        req.fileCounter = 0;
                    }
                    req.fileCounter++;
                    let finalFilename = originalname;
                    if (filenameQuery) {
                        const currentCount = req.fileCounter;
                        finalFilename = `${filenameQuery}${currentCount}${extension}`;
                    }
                    console.log(`Saving file as: ${finalFilename}`);
                    cb(null, finalFilename);
                }
                catch (error) {
                    console.error(`Error setting filename: ${error.message}`);
                    cb(error, null);
                }
            },
        }),
        limits: { fileSize: MAX_FILE_SIZE },
    })),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload files to a folder',
        description: 'Upload single or multiple files to a specified folder',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['files'],
            properties: {
                files: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Files to upload',
                },
            },
        },
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Target folder name' }),
    (0, swagger_1.ApiQuery)({
        name: 'filename',
        required: false,
        description: 'Optional custom filename for single file upload',
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.UploadedFiles)(new common_1.ParseFilePipe({
        validators: [
            new file_validators_1.CustomFileValidator({
                fileTypes: file_config_1.FILE_CONFIG.ALLOWED_FILE_TYPES,
            }),
            new file_validators_1.FileSizeValidator({ maxSize: file_config_1.FILE_CONFIG.MAX_FILE_SIZE }),
        ],
        errorHttpStatusCode: 400,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFiles", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Get)('folders'),
    (0, swagger_1.ApiOperation)({ summary: 'List all folders' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Folders listed successfully',
        type: responses_dto_1.FolderResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Server error while listing folders',
        type: responses_dto_1.ErrorResponse,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileController.prototype, "listFolders", null);
__decorate([
    (0, common_1.Get)('folders/:folder'),
    (0, swagger_1.ApiOperation)({ summary: 'Get folder details and list files' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Folder details retrieved successfully',
        type: responses_dto_1.FolderDetailsResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Folder not found',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of files per page',
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFolderDetails", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Post)('folders'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new folder' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Folder created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid folder name',
    }),
    (0, swagger_1.ApiBody)({
        schema: { type: 'object', properties: { folderName: { type: 'string' } } },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [requests_dto_1.CreateFolderDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "createFolder", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Delete)('folders/:folder'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a folder and all its contents' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder to delete' }),
    __param(0, (0, common_1.Param)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "deleteFolder", null);
__decorate([
    (0, swagger_1.ApiTags)('File Operations'),
    (0, common_1.Get)('folders/:folder/files/:filename/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download a file from a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "downloadFile", null);
__decorate([
    (0, swagger_1.ApiTags)('File Metadata'),
    (0, common_1.Get)('folders/:folder/files/:filename/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Get metadata of a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File metadata retrieved successfully',
        type: responses_dto_1.FileMetadataResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFileMetadata", null);
__decorate([
    (0, common_1.Put)('folders/:folder/files/:filename/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move or rename a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File moved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid destination',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Current folder of the file' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'Current file name' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                newFolder: { type: 'string' },
                newFilename: { type: 'string' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_dto_1.MoveFileDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "moveFile", null);
__decorate([
    (0, common_1.Post)('folders/:folder/files/:filename/copy'),
    (0, swagger_1.ApiOperation)({ summary: 'Copy a file to another location' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'File copied successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid destination' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Source folder' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File to copy' }),
    (0, swagger_1.ApiBody)({
        schema: { type: 'object', properties: { newFolder: { type: 'string' } } },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_dto_1.CopyFileDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "copyFile", null);
__decorate([
    (0, common_1.Get)('folders/:folder/files/download-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Download all files in a folder as a ZIP archive' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "downloadAllFiles", null);
__decorate([
    (0, common_1.Get)('folders/:folder/files/temp-links'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get temporary access links for all files in a folder',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    __param(0, (0, common_1.Param)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getTemporaryLinks", null);
__decorate([
    (0, swagger_1.ApiTags)('File Sharing'),
    (0, common_1.Get)('folders/:folder/files/:filename/temp-link'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a temporary access link for a file' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getTemporaryFileLink", null);
__decorate([
    (0, swagger_1.ApiTags)('Search & Browse'),
    (0, common_1.Get)('folders/:folder/files/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for files by name in a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiQuery)({
        name: 'pattern',
        description: 'Regex pattern for matching filenames',
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Query)('pattern')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "searchFiles", null);
__decorate([
    (0, swagger_1.ApiTags)('JSON Operations'),
    (0, common_1.Get)('json/folders/:folder/files/:filename'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve the entire JSON file',
        description: 'Returns the complete contents of a JSON file',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'JSON file contents retrieved successfully',
        type: responses_dto_1.JsonFileResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'JSON file not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Error parsing JSON file',
        type: responses_dto_1.ErrorResponse,
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getJsonFile", null);
__decorate([
    (0, swagger_1.ApiTags)('JSON Operations'),
    (0, common_1.Get)('json/folders/:folder/files/:filename/*path'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve a nested value from a JSON file by key path',
        description: 'Returns a specific value from a JSON file using a path with / as separator',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'JSON value retrieved successfully',
        type: responses_dto_1.JsonValueResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid path or key not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'JSON file not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiParam)({
        name: 'path',
        description: 'Path to the nested value (e.g., user/profile/name)',
        type: String,
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_dto_2.JsonPathParams]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getNestedJsonValue", null);
__decorate([
    (0, swagger_1.ApiTags)('JSON Operations'),
    (0, common_1.Get)('json/folders/:folder/files/:filename/query'),
    (0, swagger_1.ApiOperation)({
        summary: 'Query a JSON file using dot notation',
        description: 'Query JSON data using dot notation and array indices. Example: users[0].profile.name',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'JSON value retrieved successfully',
        type: responses_dto_1.JsonValueResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid query format or path not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'JSON file not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        description: 'JSON path query using dot notation (e.g., users[0].profile.name)',
        required: true,
        type: String,
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "queryJsonFile", null);
__decorate([
    (0, swagger_1.ApiTags)('File Operations'),
    (0, common_1.Delete)('folders/:folder/files/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a file from a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "deleteFile", null);
__decorate([
    (0, swagger_1.ApiTags)('File Metadata'),
    (0, common_1.Put)('folders/:folder/files/:filename/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Update file metadata' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File metadata updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid metadata' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'File not found' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                newFilename: { type: 'string', description: 'New filename' },
                newFolder: { type: 'string', description: 'New folder' },
            },
        },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, requests_dto_1.UpdateFileMetadataDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "updateFileMetadata", null);
__decorate([
    (0, common_1.Get)('folders/:folder/size'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the total size of a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    __param(0, (0, common_1.Param)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getFolderSize", null);
__decorate([
    (0, common_1.Get)('folders/:folder/files'),
    (0, swagger_1.ApiOperation)({ summary: 'List all files in a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    __param(0, (0, common_1.Param)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)('folders/:folder/files/:filename/thumbnail'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a thumbnail of an image or video file' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getThumbnail", null);
__decorate([
    (0, swagger_1.ApiTags)('File Operations'),
    (0, common_1.Get)('folders/:folder/files/:filename'),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve a file from a folder' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getFile", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Put)('folders/:folder/rename'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename a folder' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Folder renamed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid folder name' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Folder not found' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Current folder name' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { newFolderName: { type: 'string' } },
        },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_dto_1.RenameFolderDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "renameFolder", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Put)('folders/:folder/move'),
    (0, swagger_1.ApiOperation)({ summary: 'Move a folder to a different location' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Folder moved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid destination' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Folder not found' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Current folder name' }),
    (0, swagger_1.ApiBody)({
        schema: { type: 'object', properties: { newLocation: { type: 'string' } } },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, requests_dto_1.MoveFolderDto]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "moveFolder", null);
__decorate([
    (0, common_1.Get)('folders/:folder/files/:filename/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a preview of a file' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getFilePreview", null);
__decorate([
    (0, swagger_1.ApiTags)('Search & Browse'),
    (0, common_1.Get)('folders/tree'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a hierarchical tree structure of folders and files',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Folder tree retrieved successfully',
        type: responses_dto_1.FolderTreeResponse,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFolderTree", null);
__decorate([
    (0, swagger_1.ApiTags)('File Sharing'),
    (0, common_1.Post)('folders/:folder/files/:filename/share'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a shareable link for a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Shareable link generated',
        type: responses_dto_1.ShareableLinkResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "generateShareableLink", null);
__decorate([
    (0, swagger_1.ApiTags)('File Locking'),
    (0, common_1.Put)('folders/:folder/files/:filename/lock'),
    (0, swagger_1.ApiOperation)({ summary: 'Lock a file for editing' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'File is already locked',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found',
        type: responses_dto_1.ErrorResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Error locking file',
        type: responses_dto_1.ErrorResponse,
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "lockFile", null);
__decorate([
    (0, swagger_1.ApiTags)('File Locking'),
    (0, common_1.Put)('folders/:folder/files/:filename/unlock'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlock a file for editing' }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "unlockFile", null);
__decorate([
    (0, swagger_1.ApiTags)('Search & Browse'),
    (0, common_1.Get)('files/recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a list of recently modified files' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getRecentFiles", null);
__decorate([
    (0, swagger_1.ApiTags)('File Versions'),
    (0, common_1.Get)('folders/:folder/files/:filename/versions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get different versions of a file' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File versions retrieved successfully',
        type: responses_dto_1.FileVersionResponse,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'File not found',
    }),
    (0, swagger_1.ApiParam)({ name: 'folder', description: 'Folder name' }),
    (0, swagger_1.ApiParam)({ name: 'filename', description: 'File name' }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFileVersions", null);
__decorate([
    (0, common_1.Get)('metrics/file-operations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get file operation metrics',
        description: 'Retrieve metrics about recent file operations including success rate and performance data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'File operation metrics retrieved successfully',
        type: responses_dto_1.FileOperationMetricsResponse,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'timeWindow',
        required: false,
        description: 'Time window in milliseconds for failure rate calculation',
        type: Number,
        example: 3600000,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Maximum number of metrics to return',
        type: Number,
        example: 100,
    }),
    __param(0, (0, common_1.Query)('timeWindow', new common_1.DefaultValuePipe(3600000), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", responses_dto_1.FileOperationMetricsResponse)
], FileController.prototype, "getFileOperationMetrics", null);
__decorate([
    (0, swagger_1.ApiTags)('Folder Management'),
    (0, common_1.Post)('folders/:folder/copy'),
    (0, swagger_1.ApiOperation)({
        summary: 'Copy a folder to a new location',
        description: 'Creates a copy of a folder and all its contents at a new location',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Folder copied successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                sourceFolder: { type: 'string' },
                destinationFolder: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid destination or destination already exists',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Source folder not found',
    }),
    (0, swagger_1.ApiParam)({
        name: 'folder',
        description: 'Source folder name to copy',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['destinationFolder'],
            properties: {
                destinationFolder: {
                    type: 'string',
                    description: 'Name of the destination folder where the copy will be created',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('folder')),
    __param(1, (0, common_1.Body)('destinationFolder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "copyFolder", null);
exports.FileController = FileController = FileController_1 = __decorate([
    (0, swagger_1.ApiTags)('Folders & Files'),
    (0, common_1.Injectable)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);


/***/ }),

/***/ "./src/files/file.module.interface.ts":
/*!********************************************!*\
  !*** ./src/files/file.module.interface.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FILE_MODULE_OPTIONS = void 0;
exports.FILE_MODULE_OPTIONS = 'FILE_MODULE_OPTIONS';


/***/ }),

/***/ "./src/files/file.module.ts":
/*!**********************************!*\
  !*** ./src/files/file.module.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const file_controller_1 = __webpack_require__(/*! ./file.controller */ "./src/files/file.controller.ts");
const file_service_1 = __webpack_require__(/*! ./file.service */ "./src/files/file.service.ts");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const file_config_1 = __webpack_require__(/*! ./config/file.config */ "./src/files/config/file.config.ts");
const file_module_interface_1 = __webpack_require__(/*! ./file.module.interface */ "./src/files/file.module.interface.ts");
let FileModule = FileModule_1 = class FileModule {
    static register() {
        return {
            module: FileModule_1,
            imports: [
                platform_express_1.MulterModule.register({
                    dest: file_config_1.FILE_CONFIG.STORAGE_PATH,
                }),
            ],
            controllers: [file_controller_1.FileController],
            providers: [file_service_1.FileService],
            exports: [file_service_1.FileService],
        };
    }
    static forRoot(options = {}) {
        const providers = [
            {
                provide: file_module_interface_1.FILE_MODULE_OPTIONS,
                useValue: {
                    storagePath: options.storagePath || file_config_1.FILE_CONFIG.STORAGE_PATH,
                    maxFileSize: options.maxFileSize || file_config_1.FILE_CONFIG.MAX_FILE_SIZE,
                    allowedFileTypes: options.allowedFileTypes || file_config_1.FILE_CONFIG.ALLOWED_FILE_TYPES,
                },
            },
            file_service_1.FileService,
        ];
        return {
            module: FileModule_1,
            imports: [
                platform_express_1.MulterModule.register({
                    dest: options.storagePath || file_config_1.FILE_CONFIG.STORAGE_PATH,
                }),
            ],
            controllers: [file_controller_1.FileController],
            providers: providers,
            exports: [file_service_1.FileService],
        };
    }
    static forRootGlobal(options = {}) {
        const module = this.forRoot(options);
        return {
            ...module,
            global: true,
        };
    }
};
exports.FileModule = FileModule;
exports.FileModule = FileModule = FileModule_1 = __decorate([
    (0, common_1.Module)({})
], FileModule);


/***/ }),

/***/ "./src/files/file.service.ts":
/*!***********************************!*\
  !*** ./src/files/file.service.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FileService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const path_1 = __webpack_require__(/*! path */ "path");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const archiver_1 = __importDefault(__webpack_require__(/*! archiver */ "archiver"));
const file_config_1 = __webpack_require__(/*! ./config/file.config */ "./src/files/config/file.config.ts");
const view_config_1 = __webpack_require__(/*! ./config/view.config */ "./src/files/config/view.config.ts");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const mime_types_1 = __webpack_require__(/*! mime-types */ "mime-types");
const json_path_validator_1 = __webpack_require__(/*! ./utils/json-path.validator */ "./src/files/utils/json-path.validator.ts");
const file_operation_error_1 = __webpack_require__(/*! ./utils/file-operation-error */ "./src/files/utils/file-operation-error.ts");
const file_operation_wrapper_1 = __webpack_require__(/*! ./utils/file-operation-wrapper */ "./src/files/utils/file-operation-wrapper.ts");
const file_module_interface_1 = __webpack_require__(/*! ./file.module.interface */ "./src/files/file.module.interface.ts");
let FileService = FileService_1 = class FileService {
    constructor(options) {
        this.options = options;
        this.logger = new common_1.Logger(FileService_1.name);
        this.config = {
            storagePath: options?.storagePath || file_config_1.FILE_CONFIG.STORAGE_PATH,
            maxFileSize: options?.maxFileSize || file_config_1.FILE_CONFIG.MAX_FILE_SIZE,
            allowedFileTypes: options?.allowedFileTypes || file_config_1.FILE_CONFIG.ALLOWED_FILE_TYPES,
        };
        this.logger.log(`FileService initialized with storage path: ${this.config.storagePath}`);
    }
    getSafePath(...segments) {
        const filePath = (0, path_1.join)(...segments);
        const resolvedPath = (0, path_1.resolve)(filePath);
        const uploadsPath = (0, path_1.resolve)(this.config.storagePath);
        if (!resolvedPath.startsWith(uploadsPath)) {
            throw new Error(`Invalid path detected: ${resolvedPath}`);
        }
        return filePath;
    }
    validateFileType(file) {
        return this.config.allowedFileTypes.includes(file.mimetype);
    }
    validateFileSize(file) {
        return file.size <= this.config.maxFileSize;
    }
    async listFolders() {
        const result = await (0, file_operation_wrapper_1.withFileOperation)('listFolders', async () => {
            if (!fs.existsSync(this.config.storagePath)) {
                fs.mkdirSync(this.config.storagePath, { recursive: true });
            }
            const folders = fs
                .readdirSync(this.config.storagePath, { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name);
            return { folders };
        });
        if (!result.success) {
            this.logger.error(`Failed to list folders: ${result.error.message}`);
            throw new common_1.InternalServerErrorException('Failed to list folders');
        }
        return result.data;
    }
    async getFolderDetails(folder, page = 1, limit = 10) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        const files = fs.readdirSync(folderPath);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedFiles = files.slice(startIndex, endIndex);
        return {
            folder,
            files: paginatedFiles,
            totalFiles: files.length,
            page,
            limit,
        };
    }
    async createFolder(folderName) {
        const result = await (0, file_operation_wrapper_1.withFileOperation)('createFolder', async () => {
            const folderPath = this.getSafePath(this.config.storagePath, folderName);
            if (fs.existsSync(folderPath)) {
                throw new file_operation_error_1.FileOperationError('Folder already exists', file_operation_error_1.FileErrorCodes.FOLDER_EXISTS, 'createFolder', { folderName });
            }
            fs.mkdirSync(folderPath, { recursive: true });
            return { message: 'Folder created successfully', folder: folderName };
        });
        if (!result.success) {
            if (result.error.code === file_operation_error_1.FileErrorCodes.FOLDER_EXISTS) {
                throw new common_1.BadRequestException(result.error.message);
            }
            this.logger.error(`Failed to create folder: ${result.error.message}`);
            throw new common_1.InternalServerErrorException('Failed to create folder');
        }
        return result.data;
    }
    async deleteFolder(folder) {
        const result = await (0, file_operation_wrapper_1.withFileOperation)('deleteFolder', async () => {
            const folderPath = this.getSafePath(this.config.storagePath, folder);
            if (!fs.existsSync(folderPath)) {
                throw new file_operation_error_1.FileOperationError('Folder not found', file_operation_error_1.FileErrorCodes.FILE_NOT_FOUND, 'deleteFolder', { folder });
            }
            const files = fs.readdirSync(folderPath);
            if (files.length > 0) {
                throw new file_operation_error_1.FileOperationError('Cannot delete non-empty folder', file_operation_error_1.FileErrorCodes.FOLDER_NOT_EMPTY, 'deleteFolder', { folder, fileCount: files.length });
            }
            fs.rmdirSync(folderPath);
            return { message: 'Folder deleted successfully' };
        });
        if (!result.success) {
            if (result.error.code === file_operation_error_1.FileErrorCodes.FILE_NOT_FOUND) {
                throw new common_1.NotFoundException(result.error.message);
            }
            if (result.error.code === file_operation_error_1.FileErrorCodes.FOLDER_NOT_EMPTY) {
                throw new common_1.BadRequestException(result.error.message);
            }
            this.logger.error(`Failed to delete folder: ${result.error.message}`);
            throw new common_1.InternalServerErrorException('Failed to delete folder');
        }
        return result.data;
    }
    getDestination(req, file, cb) {
        try {
            const folderPath = this.getSafePath(this.config.storagePath, req.params.folder);
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            cb(null, folderPath);
        }
        catch (error) {
            cb(error, null);
        }
    }
    getFilename(req, file, cb) {
        try {
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
            const baseFilename = req.query.filename || 'uploaded_file';
            const files = req.files;
            let finalFilename;
            if (files.length === 1) {
                finalFilename = `${baseFilename}${extension}`;
            }
            else {
                if (!req._fileCounter) {
                    req._fileCounter = 0;
                }
                req._fileCounter++;
                finalFilename = `${baseFilename}${req._fileCounter}${extension}`;
            }
            cb(null, finalFilename);
        }
        catch (error) {
            cb(error, null);
        }
    }
    uploadFiles(folder, files) {
        if (!files || files.length === 0) {
            this.logger.error(`No files provided for folder ${folder}`);
            throw new common_1.BadRequestException('File upload failed: No files provided');
        }
        const uploadedFiles = files.map((file) => {
            if (!this.validateFileType(file)) {
                this.logger.error(`Invalid file type: ${file.mimetype} for ${file.originalname}`);
                throw new common_1.BadRequestException(`Invalid file type for ${file.originalname}`);
            }
            if (!this.validateFileSize(file)) {
                this.logger.error(`File size exceeds limit: ${file.size} bytes`);
                throw new common_1.BadRequestException(`File size exceeds limit for ${file.originalname}`);
            }
            this.logger.log(`File uploaded: ${file.filename} to folder: ${folder}`);
            return { filename: file.filename };
        });
        return { message: 'Files uploaded successfully', files: uploadedFiles };
    }
    downloadFile(folder, filename, res) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        return res.download(filePath);
    }
    async getFileMetadata(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        try {
            const stats = fs.statSync(filePath);
            return {
                filename,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
            };
        }
        catch (error) {
            this.logger.error(`Error retrieving metadata for ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error retrieving file metadata');
        }
    }
    moveFile(folder, filename, body) {
        const oldPath = this.getSafePath(this.config.storagePath, folder, filename);
        const newFolder = body.newFolder || folder;
        const newFilename = body.newFilename || filename;
        const newFolderPath = this.getSafePath(this.config.storagePath, newFolder);
        if (!fs.existsSync(newFolderPath)) {
            try {
                fs.mkdirSync(newFolderPath, { recursive: true });
                this.logger.log(`Created destination folder: ${newFolder}`);
            }
            catch (error) {
                this.logger.error(`Error creating folder ${newFolder}: ${error.message}`);
                throw new common_1.InternalServerErrorException('Failed to create destination folder');
            }
        }
        const newPath = this.getSafePath(newFolderPath, newFilename);
        if (fs.existsSync(newPath)) {
            this.logger.error(`File already exists at destination: ${newPath}`);
            throw new common_1.BadRequestException('File already exists at destination');
        }
        try {
            fs.renameSync(oldPath, newPath);
            this.logger.log(`File moved from ${oldPath} to ${newPath}`);
            return { message: 'File moved/renamed successfully', newPath };
        }
        catch (error) {
            this.logger.error(`Error moving file: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error moving file');
        }
    }
    copyFile(folder, filename, body) {
        const oldPath = this.getSafePath(this.config.storagePath, folder, filename);
        const newFolder = body.newFolder || folder;
        const newFolderPath = this.getSafePath(this.config.storagePath, newFolder);
        if (!fs.existsSync(oldPath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        if (!fs.existsSync(newFolderPath)) {
            try {
                fs.mkdirSync(newFolderPath, { recursive: true });
                this.logger.log(`Created destination folder: ${newFolder}`);
            }
            catch (error) {
                this.logger.error(`Error creating folder ${newFolder}: ${error.message}`);
                throw new common_1.InternalServerErrorException('Failed to create destination folder');
            }
        }
        const newPath = this.getSafePath(newFolderPath, filename);
        try {
            fs.copyFileSync(oldPath, newPath);
            this.logger.log(`File copied from ${oldPath} to ${newPath}`);
            return { message: 'File copied successfully', newPath };
        }
        catch (error) {
            this.logger.error(`Error copying file: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error copying file');
        }
    }
    async downloadAllFiles(folder, res) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        const files = fs.readdirSync(folderPath);
        if (files.length === 0) {
            this.logger.warn(`No files found in folder: ${folder}`);
            throw new common_1.BadRequestException('No files available in this folder');
        }
        const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
        res.attachment(`${folder}.zip`);
        archive.pipe(res);
        files.forEach((file) => {
            try {
                const filePath = this.getSafePath(folderPath, file);
                archive.file(filePath, { name: file });
            }
            catch (error) {
                this.logger.error(`Error adding file ${file} to ZIP: ${error.message}`);
            }
        });
        try {
            await archive.finalize();
            this.logger.log(`ZIP archive generated for folder: ${folder}`);
        }
        catch (error) {
            this.logger.error(`Error finalizing ZIP: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error generating ZIP archive');
        }
    }
    getTemporaryLinks(folder) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        const files = fs.readdirSync(folderPath);
        if (files.length === 0) {
            this.logger.warn(`No files found in folder: ${folder}`);
            throw new common_1.BadRequestException('No files available in this folder');
        }
        const fileLinks = files.map((file) => ({
            filename: file,
            url: `${process.env.serviceUrl}/folders/${folder}/files/${file}?temp=true`,
        }));
        return { folder, fileLinks };
    }
    getTemporaryFileLink(folder, filename) {
        return {
            url: `${process.env.serviceUrl}/folders/${folder}/files/${filename}?temp=true`,
        };
    }
    searchFiles(folder, pattern) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        let regex;
        try {
            regex = new RegExp(pattern, 'i');
        }
        catch (error) {
            console.log('error', error);
            this.logger.error(`Invalid regex: ${pattern}`);
            throw new common_1.BadRequestException('Invalid regular expression');
        }
        const files = fs.readdirSync(folderPath);
        const matchingFiles = files.filter((file) => regex.test(file));
        return { folder, pattern, matchingFiles };
    }
    async getJsonFile(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, `${filename}.json`);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`JSON file not found: ${filename}.json in folder ${folder}`);
            throw new common_1.NotFoundException('JSON file not found');
        }
        try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            return { content: JSON.parse(fileContent) };
        }
        catch (error) {
            this.logger.error(`Error parsing JSON file ${filename}.json: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error parsing JSON file');
        }
    }
    async getNestedJsonValue(folder, filename, pathParams) {
        const wildcardPath = pathParams['path'][0] || '';
        const keys = wildcardPath.split('/').filter((key) => key !== '');
        try {
            json_path_validator_1.JsonPathValidator.validate(keys);
            const filePath = this.getSafePath(this.config.storagePath, folder, `${filename}.json`);
            if (!fs.existsSync(filePath)) {
                this.logger.error(`JSON file not found: ${filename}.json in folder ${folder}`);
                throw new common_1.NotFoundException('JSON file not found');
            }
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            let result = JSON.parse(fileContent);
            for (const key of keys) {
                if (result[key] === undefined) {
                    this.logger.error(`Key '${key}' not found in ${filename}.json`);
                    throw new common_1.BadRequestException(`Key '${key}' not found`);
                }
                result = result[key];
            }
            return { value: result };
        }
        catch (error) {
            if (error instanceof json_path_validator_1.JsonPathValidationError) {
                throw new common_1.BadRequestException(error.message);
            }
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error processing JSON file ${filename}.json: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error processing JSON file');
        }
    }
    async queryJsonFile(folder, filename, query) {
        try {
            json_path_validator_1.JsonPathValidator.validateJsonQuery(query);
            const filePath = this.getSafePath(this.config.storagePath, folder, `${filename}.json`);
            if (!fs.existsSync(filePath)) {
                this.logger.error(`JSON file not found: ${filename}.json in folder ${folder}`);
                throw new common_1.NotFoundException('JSON file not found');
            }
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const jsonData = JSON.parse(fileContent);
            const segments = query.split('.');
            let result = jsonData;
            for (const segment of segments) {
                const arrayMatch = segment.match(/^(\w+)\[(\d+)\]$/);
                if (arrayMatch) {
                    const [, key, index] = arrayMatch;
                    result = result[key]?.[parseInt(index, 10)];
                }
                else {
                    result = result[segment];
                }
                if (result === undefined) {
                    throw new common_1.BadRequestException(`Path '${query}' not found in JSON`);
                }
            }
            return { value: result };
        }
        catch (error) {
            if (error instanceof json_path_validator_1.JsonPathValidationError ||
                error instanceof common_1.BadRequestException) {
                throw new common_1.BadRequestException(error.message);
            }
            this.logger.error(`Error querying JSON file ${filename}.json: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error processing JSON file');
        }
    }
    deleteFile(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        try {
            fs.rmSync(filePath);
            this.logger.log(`File deleted successfully: ${filename} from folder: ${folder}`);
            return { message: 'File deleted successfully' };
        }
        catch (error) {
            this.logger.error(`Error deleting file ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error deleting file');
        }
    }
    updateFileMetadata(folder, filename, body) {
        const oldPath = this.getSafePath(this.config.storagePath, folder, filename);
        const newFolder = body.newFolder || folder;
        const newFilename = body.newFilename || filename;
        const newFolderPath = this.getSafePath(this.config.storagePath, newFolder);
        if (!fs.existsSync(newFolderPath)) {
            try {
                fs.mkdirSync(newFolderPath, { recursive: true });
                this.logger.log(`Created destination folder: ${newFolder}`);
            }
            catch (error) {
                this.logger.error(`Error creating folder ${newFolder}: ${error.message}`);
                throw new common_1.InternalServerErrorException('Failed to create destination folder');
            }
        }
        const newPath = this.getSafePath(newFolderPath, newFilename);
        if (fs.existsSync(newPath)) {
            this.logger.error(`File already exists at destination: ${newPath}`);
            throw new common_1.BadRequestException('File already exists at destination');
        }
        try {
            fs.renameSync(oldPath, newPath);
            this.logger.log(`File metadata updated from ${oldPath} to ${newPath}`);
            return { message: 'File metadata updated successfully', newPath };
        }
        catch (error) {
            this.logger.error(`Error updating file metadata: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error updating file metadata');
        }
    }
    getFolderSize(folder) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        const getSize = (dirPath) => {
            const files = fs.readdirSync(dirPath);
            return files.reduce((total, file) => {
                const filePath = this.getSafePath(dirPath, file);
                const stats = fs.statSync(filePath);
                return total + (stats.isDirectory() ? getSize(filePath) : stats.size);
            }, 0);
        };
        const size = getSize(folderPath);
        return { folder, size };
    }
    listFiles(folder) {
        const folderPath = this.getSafePath(this.config.storagePath, folder);
        if (!fs.existsSync(folderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        const files = fs.readdirSync(folderPath);
        return { folder, files };
    }
    getFile(folder, filename, res) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        return res.sendFile(filePath);
    }
    renameFolder(folder, newFolderName) {
        const oldFolderPath = this.getSafePath(this.config.storagePath, folder);
        const newFolderPath = this.getSafePath(this.config.storagePath, newFolderName);
        if (!fs.existsSync(oldFolderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        if (fs.existsSync(newFolderPath)) {
            this.logger.error(`Folder already exists: ${newFolderName}`);
            throw new common_1.BadRequestException('Folder already exists');
        }
        try {
            fs.renameSync(oldFolderPath, newFolderPath);
            this.logger.log(`Folder renamed from ${folder} to ${newFolderName}`);
            return { message: 'Folder renamed successfully', newFolderName };
        }
        catch (error) {
            this.logger.error(`Error renaming folder ${folder}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error renaming folder');
        }
    }
    moveFolder(folder, newLocation) {
        const oldFolderPath = this.getSafePath(this.config.storagePath, folder);
        const newFolderPath = this.getSafePath(this.config.storagePath, newLocation, folder);
        if (!fs.existsSync(oldFolderPath)) {
            this.logger.error(`Folder not found: ${folder}`);
            throw new common_1.NotFoundException('Folder not found');
        }
        if (fs.existsSync(newFolderPath)) {
            this.logger.error(`Folder already exists at destination: ${newFolderPath}`);
            throw new common_1.BadRequestException('Folder already exists at destination');
        }
        try {
            fs.renameSync(oldFolderPath, newFolderPath);
            this.logger.log(`Folder moved from ${oldFolderPath} to ${newFolderPath}`);
            return { message: 'Folder moved successfully', newFolderPath };
        }
        catch (error) {
            this.logger.error(`Error moving folder ${folder}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error moving folder');
        }
    }
    async getFilePreview(folder, filename, req, res) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const stats = fs.statSync(filePath);
        const mimeType = (0, mime_types_1.lookup)(filePath) || 'application/octet-stream';
        if (stats.size > view_config_1.VIEW_CONFIG.PREVIEW_SIZE_LIMIT) {
            if (!this.isPreviewSupported(mimeType)) {
                throw new common_1.BadRequestException('Preview not available for this file type or size');
            }
        }
        try {
            if (view_config_1.VIEW_CONFIG.IMAGE_TYPES.includes(mimeType)) {
                const thumbnail = fs.readFileSync(filePath);
                res.setHeader('Content-Type', mimeType);
                return res.send(thumbnail);
            }
            if (view_config_1.VIEW_CONFIG.VIDEO_TYPES.includes(mimeType) ||
                view_config_1.VIEW_CONFIG.AUDIO_TYPES.includes(mimeType)) {
                const range = req.headers.range;
                if (range) {
                    const parts = range.replace(/bytes=/, '').split('-');
                    const start = parseInt(parts[0], 10);
                    const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
                    const chunkSize = end - start + 1;
                    const stream = fs.createReadStream(filePath, { start, end });
                    const headers = {
                        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunkSize,
                        'Content-Type': mimeType,
                    };
                    res.writeHead(206, headers);
                    return stream.pipe(res);
                }
                else {
                    const headers = {
                        'Content-Length': stats.size,
                        'Content-Type': mimeType,
                        'Accept-Ranges': 'bytes',
                    };
                    res.writeHead(200, headers);
                    return fs.createReadStream(filePath).pipe(res);
                }
            }
            if (view_config_1.VIEW_CONFIG.TEXT_TYPES.includes(mimeType)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const preview = content.substring(0, 1000) + (content.length > 1000 ? '...' : '');
                return { preview, mimeType };
            }
            if (view_config_1.VIEW_CONFIG.PDF_TYPES.includes(mimeType)) {
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-Range', `bytes 0-${Math.min(stats.size, view_config_1.VIEW_CONFIG.PREVIEW_SIZE_LIMIT)}`);
                const stream = (0, fs_1.createReadStream)(filePath, {
                    start: 0,
                    end: view_config_1.VIEW_CONFIG.PREVIEW_SIZE_LIMIT - 1,
                });
                return stream.pipe(res);
            }
            throw new common_1.BadRequestException('Preview not available for this file type');
        }
        catch (error) {
            this.logger.error(`Error generating preview for ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error generating file preview');
        }
    }
    async getThumbnail(folder, filename, res) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const mimeType = (0, mime_types_1.lookup)(filePath) || 'application/octet-stream';
        try {
            if (view_config_1.VIEW_CONFIG.IMAGE_TYPES.includes(mimeType)) {
                const thumbnail = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'image/jpeg');
                return res.send(thumbnail);
            }
            if (view_config_1.VIEW_CONFIG.VIDEO_TYPES.includes(mimeType)) {
                res.setHeader('Content-Type', 'image/jpeg');
                return res.send(undefined);
            }
            throw new common_1.BadRequestException('Thumbnail not available for this file type');
        }
        catch (error) {
            this.logger.error(`Error generating thumbnail for ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error generating thumbnail');
        }
    }
    isPreviewSupported(mimeType) {
        const supportedTypes = [
            ...view_config_1.VIEW_CONFIG.IMAGE_TYPES,
            ...view_config_1.VIEW_CONFIG.PDF_TYPES,
            ...view_config_1.VIEW_CONFIG.TEXT_TYPES,
            ...view_config_1.VIEW_CONFIG.AUDIO_TYPES,
            ...view_config_1.VIEW_CONFIG.VIDEO_TYPES,
        ];
        return supportedTypes.includes(mimeType);
    }
    async getFolderTree() {
        const buildTree = (dirPath) => {
            const name = dirPath.split('/').pop();
            const item = { name, children: [] };
            const files = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const file of files) {
                if (file.isDirectory()) {
                    item.children.push(buildTree((0, path_1.join)(dirPath, file.name)));
                }
                else {
                    item.children.push({ name: file.name });
                }
            }
            return item;
        };
        return buildTree(this.config.storagePath);
    }
    async generateShareableLink(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const shareableLink = `${process.env.serviceUrl}/folders/${folder}/files/${filename}?share=true`;
        return { shareableLink };
    }
    lockFile(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const lockFilePath = `${filePath}.lock`;
        if (fs.existsSync(lockFilePath)) {
            this.logger.error(`File is already locked: ${filename}`);
            throw new common_1.BadRequestException('File is already locked');
        }
        try {
            fs.writeFileSync(lockFilePath, '');
            this.logger.log(`File locked successfully: ${filename}`);
            return { message: 'File locked successfully' };
        }
        catch (error) {
            this.logger.error(`Error locking file ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error locking file');
        }
    }
    unlockFile(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const lockFilePath = `${filePath}.lock`;
        if (!fs.existsSync(lockFilePath)) {
            this.logger.error(`File is not locked: ${filename}`);
            throw new common_1.BadRequestException('File is not locked');
        }
        try {
            fs.rmSync(lockFilePath);
            this.logger.log(`File unlocked successfully: ${filename}`);
            return { message: 'File unlocked successfully' };
        }
        catch (error) {
            this.logger.error(`Error unlocking file ${filename}: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error unlocking file');
        }
    }
    getRecentFiles() {
        const getRecentFilesFromDir = (dirPath) => {
            const files = fs.readdirSync(dirPath, { withFileTypes: true });
            let recentFiles = [];
            for (const file of files) {
                const filePath = (0, path_1.join)(dirPath, file.name);
                if (file.isDirectory()) {
                    recentFiles = recentFiles.concat(getRecentFilesFromDir(filePath));
                }
                else {
                    const stats = fs.statSync(filePath);
                    recentFiles.push({ name: file.name, modifiedAt: stats.mtime });
                }
            }
            return recentFiles;
        };
        const recentFiles = getRecentFilesFromDir(this.config.storagePath);
        recentFiles.sort((a, b) => b.modifiedAt - a.modifiedAt);
        return recentFiles.slice(0, 10);
    }
    async getFileVersions(folder, filename) {
        const filePath = this.getSafePath(this.config.storagePath, folder, filename);
        if (!fs.existsSync(filePath)) {
            this.logger.error(`File not found: ${filename} in folder: ${folder}`);
            throw new common_1.NotFoundException('File not found');
        }
        const versionFiles = fs
            .readdirSync(this.config.storagePath)
            .filter((file) => file.startsWith(`${filename}.v`))
            .map((file) => ({ version: file.split('.v')[1], filename: file }));
        return { filename, versions: versionFiles };
    }
    onModuleInit() {
        const thumbnailsPath = this.getSafePath(this.config.storagePath, '.thumbnails');
        if (!fs.existsSync(thumbnailsPath)) {
            fs.mkdirSync(thumbnailsPath, { recursive: true });
        }
    }
    async copyFolder(sourceFolder, destinationFolder) {
        const sourcePath = this.getSafePath(this.config.storagePath, sourceFolder);
        const destPath = this.getSafePath(this.config.storagePath, destinationFolder);
        if (!fs.existsSync(sourcePath)) {
            this.logger.error(`Source folder not found: ${sourceFolder}`);
            throw new common_1.NotFoundException('Source folder not found');
        }
        if (fs.existsSync(destPath)) {
            this.logger.error(`Destination folder already exists: ${destinationFolder}`);
            throw new common_1.BadRequestException('Destination folder already exists');
        }
        try {
            fs.mkdirSync(destPath, { recursive: true });
            const copyRecursive = (src, dest) => {
                const entries = fs.readdirSync(src, { withFileTypes: true });
                for (const entry of entries) {
                    const srcPath = (0, path_1.join)(src, entry.name);
                    const destPath = (0, path_1.join)(dest, entry.name);
                    if (entry.isDirectory()) {
                        fs.mkdirSync(destPath, { recursive: true });
                        copyRecursive(srcPath, destPath);
                    }
                    else {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }
            };
            copyRecursive(sourcePath, destPath);
            this.logger.log(`Folder copied from ${sourcePath} to ${destPath}`);
            return {
                message: 'Folder copied successfully',
                sourceFolder,
                destinationFolder,
            };
        }
        catch (error) {
            this.logger.error(`Error copying folder: ${error.message}`);
            throw new common_1.InternalServerErrorException('Error copying folder');
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(file_module_interface_1.FILE_MODULE_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], FileService);


/***/ }),

/***/ "./src/files/utils/file-operation-error.ts":
/*!*************************************************!*\
  !*** ./src/files/utils/file-operation-error.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileErrorCodes = exports.FileOperationError = void 0;
class FileOperationError extends Error {
    constructor(message, code, operation, details) {
        super(message);
        this.code = code;
        this.operation = operation;
        this.details = details;
        this.name = 'FileOperationError';
    }
}
exports.FileOperationError = FileOperationError;
exports.FileErrorCodes = {
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    INVALID_PATH: 'INVALID_PATH',
    ACCESS_DENIED: 'ACCESS_DENIED',
    INVALID_OPERATION: 'INVALID_OPERATION',
    STORAGE_FULL: 'STORAGE_FULL',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FOLDER_EXISTS: 'FOLDER_EXISTS',
    FILE_EXISTS: 'FILE_EXISTS',
    FOLDER_NOT_EMPTY: 'FOLDER_NOT_EMPTY',
};


/***/ }),

/***/ "./src/files/utils/file-operation-monitor.ts":
/*!***************************************************!*\
  !*** ./src/files/utils/file-operation-monitor.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileOperationMonitor = void 0;
class FileOperationMonitor {
    static recordOperation(metric) {
        this.metrics.unshift(metric);
        if (this.metrics.length > this.MAX_METRICS) {
            this.metrics.pop();
        }
    }
    static getMetrics(limit = 100) {
        return this.metrics.slice(0, limit);
    }
    static getFailureRate(timeWindow = 3600000) {
        const now = Date.now();
        const recentOperations = this.metrics.filter((m) => now - m.timestamp < timeWindow);
        if (recentOperations.length === 0)
            return 0;
        const failures = recentOperations.filter((m) => !m.success).length;
        return failures / recentOperations.length;
    }
    static clearMetrics() {
        this.metrics = [];
    }
}
exports.FileOperationMonitor = FileOperationMonitor;
FileOperationMonitor.metrics = [];
FileOperationMonitor.MAX_METRICS = 1000;


/***/ }),

/***/ "./src/files/utils/file-operation-wrapper.ts":
/*!***************************************************!*\
  !*** ./src/files/utils/file-operation-wrapper.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileOperationResult = void 0;
exports.withFileOperation = withFileOperation;
const file_operation_error_1 = __webpack_require__(/*! ./file-operation-error */ "./src/files/utils/file-operation-error.ts");
const file_operation_monitor_1 = __webpack_require__(/*! ./file-operation-monitor */ "./src/files/utils/file-operation-monitor.ts");
class FileOperationResult {
    constructor(success, data, error) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
    static success(data) {
        return new FileOperationResult(true, data);
    }
    static failure(error) {
        return new FileOperationResult(false, undefined, error);
    }
}
exports.FileOperationResult = FileOperationResult;
async function withFileOperation(operation, action, path) {
    const startTime = Date.now();
    try {
        const result = await action();
        file_operation_monitor_1.FileOperationMonitor.recordOperation({
            operation,
            success: true,
            duration: Date.now() - startTime,
            timestamp: startTime,
            path,
        });
        return FileOperationResult.success(result);
    }
    catch (error) {
        const duration = Date.now() - startTime;
        file_operation_monitor_1.FileOperationMonitor.recordOperation({
            operation,
            success: false,
            duration,
            timestamp: startTime,
            path,
            error: error.message,
        });
        if (error instanceof file_operation_error_1.FileOperationError) {
            return FileOperationResult.failure(error);
        }
        let fileError;
        if (error.code === 'ENOENT') {
            fileError = new file_operation_error_1.FileOperationError('File or directory not found', file_operation_error_1.FileErrorCodes.FILE_NOT_FOUND, operation);
        }
        else if (error.code === 'EACCES') {
            fileError = new file_operation_error_1.FileOperationError('Access denied', file_operation_error_1.FileErrorCodes.ACCESS_DENIED, operation);
        }
        else if (error.code === 'EEXIST') {
            fileError = new file_operation_error_1.FileOperationError('File or folder already exists', file_operation_error_1.FileErrorCodes.FILE_EXISTS, operation);
        }
        else if (error.code === 'ENOSPC') {
            fileError = new file_operation_error_1.FileOperationError('No space left on storage', file_operation_error_1.FileErrorCodes.STORAGE_FULL, operation);
        }
        else {
            fileError = new file_operation_error_1.FileOperationError(error.message || 'Unknown error occurred', file_operation_error_1.FileErrorCodes.INVALID_OPERATION, operation, error);
        }
        return FileOperationResult.failure(fileError);
    }
}


/***/ }),

/***/ "./src/files/utils/file-validators.ts":
/*!********************************************!*\
  !*** ./src/files/utils/file-validators.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileSizeValidator = exports.CustomFileValidator = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const common_2 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CustomFileValidator = class CustomFileValidator extends common_2.FileValidator {
    constructor(options) {
        super(options);
    }
    isValid(file) {
        if (!file) {
            return false;
        }
        return this.validationOptions.fileTypes.includes(file.mimetype);
    }
    buildErrorMessage() {
        return `File type must be one of: ${this.validationOptions.fileTypes.join(', ')}`;
    }
};
exports.CustomFileValidator = CustomFileValidator;
exports.CustomFileValidator = CustomFileValidator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], CustomFileValidator);
let FileSizeValidator = class FileSizeValidator extends common_2.FileValidator {
    constructor(options) {
        super(options);
    }
    isValid(file) {
        if (!file) {
            return false;
        }
        return file.size <= this.validationOptions.maxSize;
    }
    buildErrorMessage() {
        return `File size must not exceed ${this.validationOptions.maxSize / (1024 * 1024)}MB`;
    }
};
exports.FileSizeValidator = FileSizeValidator;
exports.FileSizeValidator = FileSizeValidator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], FileSizeValidator);


/***/ }),

/***/ "./src/files/utils/json-path.validator.ts":
/*!************************************************!*\
  !*** ./src/files/utils/json-path.validator.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JsonPathValidator = exports.JsonPathValidationError = void 0;
class JsonPathValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'JsonPathValidationError';
    }
}
exports.JsonPathValidationError = JsonPathValidationError;
class JsonPathValidator {
    static validate(path) {
        if (!Array.isArray(path) || path.length === 0) {
            throw new JsonPathValidationError('Path must be a non-empty array');
        }
        const validKeyRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (const segment of path) {
            if (!validKeyRegex.test(segment)) {
                throw new JsonPathValidationError(`Invalid path segment: ${segment}`);
            }
        }
        return true;
    }
    static validateJsonQuery(query) {
        const validQueryRegex = /^[\w.[\]]+$/;
        if (!validQueryRegex.test(query)) {
            throw new JsonPathValidationError('Invalid JSON query format');
        }
        return true;
    }
}
exports.JsonPathValidator = JsonPathValidator;


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "archiver":
/*!***************************!*\
  !*** external "archiver" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("archiver");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "mime-types":
/*!*****************************!*\
  !*** external "mime-types" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("mime-types");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "node-telegram-bot-api":
/*!****************************************!*\
  !*** external "node-telegram-bot-api" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("node-telegram-bot-api");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
(__webpack_require__(/*! dotenv */ "dotenv").config)();
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const swagger_config_1 = __webpack_require__(/*! ./config/swagger.config */ "./src/config/swagger.config.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    };
    app.enableCors(corsOptions);
    await app.listen(8000);
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM signal. Starting graceful shutdown...');
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('Received SIGINT signal. Starting graceful shutdown...');
    process.exit(0);
});
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=index.js.map