import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('File Storage API')
    .setVersion('1.0')
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
