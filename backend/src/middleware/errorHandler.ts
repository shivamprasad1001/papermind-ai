import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Default to a 500 server error
  let statusCode = 500;
  let message = 'An unexpected error occurred on the server.';

  // You can add more specific error type checks here if needed
  // For example, handling validation errors, etc.

  res.status(statusCode).json({ message });
};