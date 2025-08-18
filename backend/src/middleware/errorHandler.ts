import * as express from 'express';

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);

  // Default to a 500 server error
  let statusCode = 500;
  let message = 'An unexpected error occurred on the server.';

  // You can add more specific error type checks here if needed
  // For example, handling validation errors, etc.

  res.status(statusCode).json({ message });
};