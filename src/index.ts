/**
 * Main entry point for the AMS (Asset Management System) library
 * This file exports all public-facing components for use in other NestJS projects
 */

// Export modules
export * from './files/file.module';
export * from './Bot/bot.module';

// Export controllers
export * from './files/file.controller';
export * from './Bot/bot.controller';

// Export services
export * from './files/file.service';
export * from './Bot/bot.service';
export * from './Bot/bot.load-balancer';

// Export DTOs for request and response objects
export * from './files/dto/requests.dto';
export * from './files/dto/responses.dto';
export * from './Bot/dto/bot.dto';

// Export utilities that may be useful for consumers
export * from './files/utils/file-cleanup.util';
export * from './files/utils/file-operation-error';
export * from './files/utils/file-operation-wrapper';
export * from './files/utils/file-validators';
export * from './files/utils/json-path.validator';
export * from './files/utils/file-operation-monitor';

// Export interfaces and configurations
export * from './files/file.module.interface';
export * from './files/config/file.config';
export * from './files/config/view.config';
export * from './config/bot.config';
