import { Request, Response, NextFunction } from "express";

import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { ENV } from '../config/env';

export const setupSwagger = (app: Express) => {
  if (ENV.NODE_ENV === 'production') {
    // Provide JSON spec in production, but skip UI to save cold-start time
    const options: Options = {
      definition: {
        openapi: '3.0.0',
        info: { title: 'PaperMind AI API', version: '1.0.0' },
      },
      apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'],
    };
    const specs = swaggerJsdoc(options);
    app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
    return;
  }

  // Full UI in non-production
  const options: Options = {
    definition: {
      openapi: '3.0.0',
      info: { title: 'PaperMind AI API', version: '1.0.0' },
    },
    apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'],
  };
  const specs = swaggerJsdoc(options);
  const swaggerUiOptions = {
    explorer: true,
  } as any;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));
  app.get('/', (_req: Request, res: Response) => res.redirect('/api-docs'));
  app.get('/api-docs.json', (_req: Request, res: Response) => res.json(specs));
};
