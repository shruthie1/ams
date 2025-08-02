import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsObject } from 'class-validator';

export class UploadByUrlDto {
  @ApiProperty({
    example: {
      intro: 'https://cdn.example.com/video1.mp4',
      welcome: 'https://cdn.example.com/welcome',
    },
  })
  @IsObject()
  videos: Record<string, string>;
}
