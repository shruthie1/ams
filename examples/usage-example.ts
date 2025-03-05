// /**
//  * Example of how to use the AMS library in another NestJS project
//  */

// // In your app.module.ts
// import { Module } from '@nestjs/common';
// import { FileModule } from 'ams'; // Import the FileModule from the AMS package

// @Module({
//   imports: [
//     // Option 1: Register with default configuration
//     FileModule.register(),

//     // Option 2: Register with custom configuration
//     // FileModule.forRoot({
//     //   storagePath: './custom-storage-path',
//     //   maxFileSize: 50 * 1024 * 1024, // 50MB
//     //   allowedFileTypes: ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'],
//     // }),

//     // Option 3: Register as a global module
//     // FileModule.forRootGlobal({
//     //   storagePath: './global-storage',
//     // }),
//   ],
// })
// export class AppModule {}

// // In your file-management.service.ts
// import { Injectable } from '@nestjs/common';
// import { FileService } from 'ams';

// @Injectable()
// export class FileManagementService {
//   constructor(private readonly fileService: FileService) {}

//   async getAllFolders() {
//     return this.fileService.listFolders();
//   }

//   async createNewFolder(folderName: string) {
//     return this.fileService.createFolder(folderName);
//   }

//   async searchFilesInFolder(folder: string, pattern: string) {
//     return this.fileService.searchFiles(folder, pattern);
//   }

//   async getRecentlyModifiedFiles() {
//     return this.fileService.getRecentFiles();
//   }

//   async getFolderStatistics(folder: string) {
//     const size = await this.fileService.getFolderSize(folder);
//     const details = await this.fileService.getFolderDetails(folder, 1, 100);
//     return {
//       ...size,
//       fileCount: details.totalFiles,
//       details
//     };
//   }
// }

// // In your files.controller.ts
// import { Controller, Get, Post, Param, Body, Query, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { FileService } from 'ams';
// import { Response, Request } from 'express';

// @Controller('files')
// export class FilesController {
//   constructor(private readonly fileService: FileService) {}

//   @Get('folders')
//   async listFolders() {
//     return this.fileService.listFolders();
//   }

//   @Post('folders')
//   async createFolder(@Body() body: { folderName: string }) {
//     return this.fileService.createFolder(body.folderName);
//   }

//   @Get('folders/:folder')
//   async getFolderDetails(
//     @Param('folder') folder: string,
//     @Query('page') page = 1,
//     @Query('limit') limit = 10,
//   ) {
//     return this.fileService.getFolderDetails(folder, +page, +limit);
//   }

//   @Post('folders/:folder/upload')
//   @UseInterceptors(FilesInterceptor('files', 10))
//   async uploadFiles(
//     @Param('folder') folder: string,
//     @UploadedFiles() files: Express.Multer.File[],
//     @Query('filename') filename?: string,
//   ) {
//     return this.fileService.uploadFiles(folder, files, filename);
//   }

//   @Get('folders/:folder/files/:filename')
//   async getFile(
//     @Param('folder') folder: string,
//     @Param('filename') filename: string,
//     @Query('download') download = false,
//     @Res() res: Response,
//   ) {
//     if (download) {
//       return this.fileService.downloadFile(folder, filename, res);
//     }
//     return this.fileService.getFile(folder, filename, res);
//   }

//   @Get('folders/:folder/preview/:filename')
//   async getFilePreview(
//     @Param('folder') folder: string,
//     @Param('filename') filename: string,
//     @Req() req: Request,
//     @Res() res: Response,
//   ) {
//     return this.fileService.getFilePreview(folder, filename, req, res);
//   }
// }