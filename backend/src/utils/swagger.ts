// src/config/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';
import { version } from '../../package.json'; // Auto-import API version

// =============================================
// TODO: REPLACE THESE VALUES WITH YOUR REAL DATA
// =============================================
const API_INFO = {
  title: 'PDF Chat API', // TODO: Change to your API name
  description: `
## API Overview
TODO: Write a detailed description of your API here.

## Authentication
\`\`\`
Bearer Token: xxxxxx.xxxxxx.xxxxxx
\`\`\`

## Rate Limits
- 100 requests/15 minutes per IP
  `, // TODO: Add Markdown-formatted documentation
  contact: {
    name: 'API Support', // TODO: Change to your team name
    email: 'support@yourdomain.com', // TODO: Change to your support email
    url: 'https://yourdomain.com/support' // TODO: Change to your support URL
  },
  license: {
    name: 'Proprietary', // TODO: Change to 'MIT', 'Apache 2.0', etc.
    url: 'https://yourdomain.com/license' // TODO: Change to your license URL
  }
};

const SERVERS = [
  {
    url: 'https://api.yourdomain.com/v1', // TODO: Change to production URL
    description: 'Production'
  },
  {
    url: 'http://localhost:3001', 
    description: 'Local Development'
  }
];

const SECURITY_SCHEMES = {
  BearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'TODO: Add your JWT description here'
  }
};
// =============================================
// END OF CONFIGURATION SECTION
// =============================================

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: API_INFO.title,
      version: version,
      description: API_INFO.description,
      contact: API_INFO.contact,
      license: API_INFO.license
    },
    servers: SERVERS,
    components: {
      securitySchemes: SECURITY_SCHEMES,
      schemas: {
        // TODO: Add your common request/response schemas here
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            },
            code: {
              type: 'string',
              example: 'ERR_400'
            }
          }
        },
        // TODO: Add more shared schemas as needed
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            limit: { type: 'integer' },
            offset: { type: 'integer' }
          }
        }
      }
    },
    // Global security requirement (can be overridden per route)
    security: [{ BearerAuth: [] }]
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),
    path.join(__dirname, '../controllers/*.ts'),
    path.join(__dirname, '../models/*.ts') // Optional: for model documentation
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Custom Swagger UI configuration
  const swaggerUiOptions = {
    customSiteTitle: `${API_INFO.title} Documentation`, // TODO: Customize
    customCss: '.swagger-ui .topbar { display: none }', // TODO: Add your branding
    customfavIcon: '/assets/favicon.ico' // TODO: Change to your favicon
  };

  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, swaggerUiOptions)
  );

  // JSON endpoint for programmatic access
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 API docs available at /api-docs`);
};

