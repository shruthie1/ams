import { join } from "path";

// File configuration constants
export const FILE_CONFIG = {
    MAX_FILE_SIZE: 1024 * 1024 * 100, // 100MB
    MAX_FILES_PER_UPLOAD: 10,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    TEMP_LINK_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    STORAGE_PATH: join(process.cwd(), 'uploads'),
    // Add more configuration as needed
};