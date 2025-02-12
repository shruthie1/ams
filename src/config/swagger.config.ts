import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle('File Storage API')
        .setVersion('1.0')
        .addTag('Folder Management', 'Create, delete, and manage folders')
        .addTag('File Operations', 'Upload, download, and manage files')
        .addTag('File Metadata', 'View and modify file information')
        .addTag('File Versions', 'Manage file versions')
        .addTag('File Sharing', 'Generate and manage file sharing')
        .addTag('File Locking', 'Lock and unlock files for editing')
        .addTag('Search & Browse', 'Search and browse files and folders')
        .addTag('JSON Operations', 'Special operations for JSON files')
        .addServer('http://localhost:8000', 'Development Server')
        .addServer('https://api.example.com', 'Production Server (Coming Soon)')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));

    SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
            syntaxHighlight: {
                theme: 'monokai'
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
        customfavIcon: 'https://nestjs.com/favicon.ico'
    });
}