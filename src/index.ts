/**
 * Main entry point for the AMS (Asset Management System) library
 * This file exports all public-facing components for use in other NestJS projects
 */

// Export modules
export * from './files/file.module';
export * from './telegram/telegram.module';

// Export controllers
export * from './files/file.controller';
export * from './telegram/telegram.controller';

// Export services
export * from './files/file.service';
export * from './telegram/telegram.service';
export * from './telegram/telegram.load-balancer';

// Export DTOs for request and response objects
export * from './files/dto/requests.dto';
export * from './files/dto/responses.dto';
export * from './telegram/dto/telegram.dto';

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
export * from './config/telegram.config';
