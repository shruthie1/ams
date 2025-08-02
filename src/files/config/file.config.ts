import { join } from 'path';

// File configuration constants
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 2 * 1024 * 1024 * 100, // 100MB
  MAX_FILES_PER_UPLOAD: 10,
  ALLOWED_FILE_TYPES: [
    // Image types
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/heic',
    'image/heif',

    // Video types
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',      // .avi
    'video/x-ms-wmv',
    'video/x-flv',
    'video/webm',
    'video/3gpp',           // .3gp
    'video/3gpp2',          // .3g2
    'video/ogg',
    'application/ogg',
    'application/vnd.apple.mpegurl', // .m3u8
    'video/mp2t',
    'video/x-matroska',     // .mkv
  ],
  TEMP_LINK_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  STORAGE_PATH: join(process.cwd(), 'uploads'),
  // Add more configuration as needed
};
