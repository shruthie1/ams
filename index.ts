/**
 * Main entry point for the AMS (Asset Management System) library
 * This file exports all public-facing components for use in other NestJS projects
 */

// Export modules
export * from './src/files/file.module';
export * from './src/telegram/telegram.module';

// Export services
export * from './src/files/file.service';
export * from './src/telegram/telegram.service';
export * from './src/telegram/telegram.load-balancer';

// Export DTOs for request and response objects
export * from './src/files/dto/requests.dto';
export * from './src/files/dto/responses.dto';
export * from './src/telegram/dto/telegram.dto';

// Export utilities that may be useful for consumers
export * from './src/files/utils/file-cleanup.util';
export * from './src/files/utils/file-operation-error';
export * from './src/files/utils/file-operation-wrapper';
export * from './src/files/utils/file-validators';
export * from './src/files/utils/json-path.validator';

// Export interfaces and configurations
export * from './src/files/file.module.interface';
export * from './src/files/config/file.config';
export * from './src/files/config/view.config';
export * from './src/config/telegram.config';
