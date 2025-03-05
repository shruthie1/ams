<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# AMS (Asset Management System) Library

A NestJS library for file management and asset operations that can be integrated into any NestJS application.

## Features

- File and folder management (create, read, update, delete)
- File uploads and downloads
- File metadata operations
- JSON file operations with path-based queries
- File thumbnails and previews
- Folder archiving
- File search capabilities
- File sharing links

## Installation

```bash
npm install ams
```

## Usage

### Basic Usage

In your NestJS application, import the `FileModule` into your AppModule:

```typescript
import { Module } from '@nestjs/common';
import { FileModule } from 'ams';

@Module({
  imports: [
    FileModule.register(), // Use default configuration
  ],
})
export class AppModule {}
```

### Configuration Options

You can customize the module's behavior by using the `forRoot()` method:

```typescript
import { Module } from '@nestjs/common';
import { FileModule } from 'ams';

@Module({
  imports: [
    FileModule.forRoot({
      storagePath: './custom-uploads',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    }),
  ],
})
export class AppModule {}
```

### Using as a Global Module

You can also make the module available globally:

```typescript
import { Module } from '@nestjs/common';
import { FileModule } from 'ams';

@Module({
  imports: [
    FileModule.forRootGlobal({
      storagePath: './global-uploads',
    }),
  ],
})
export class AppModule {}
```

### Using the FileService

Once you've imported the module, you can inject the FileService into your controllers or services:

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { FileService } from 'ams';

@Controller('my-files')
export class MyFilesController {
  constructor(private readonly fileService: FileService) {}

  @Get('folders')
  async listAllFolders() {
    return this.fileService.listFolders();
  }
  
  @Get('recent')
  async getRecentFiles() {
    return this.fileService.getRecentFiles();
  }
}
```

## Available Methods

The FileService provides many methods for file and folder operations:

- `listFolders()`: List all folders
- `getFolderDetails(folder, page, limit)`: Get paginated folder contents
- `createFolder(folderName)`: Create a new folder
- `deleteFolder(folder)`: Delete an empty folder
- `uploadFiles(folder, files, filenameQuery)`: Upload files to a folder
- `downloadFile(folder, filename, res)`: Download a specific file
- `getFileMetadata(folder, filename)`: Get metadata for a file
- `moveFile(folder, filename, body)`: Move or rename a file
- `copyFile(folder, filename, body)`: Copy a file
- `deleteFile(folder, filename)`: Delete a file
- `getJsonFile(folder, filename)`: Get content of a JSON file
- `queryJsonFile(folder, filename, query)`: Query a JSON file using path notation
- ... and many more

## API Documentation

After installing and configuring the module, you can access the Swagger documentation for the API endpoints at:

```
http://your-app-url/api-docs
```

## License

MIT

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
