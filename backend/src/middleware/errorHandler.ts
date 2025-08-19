import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Default to a 500 server error
  let statusCode = 500;
  let message = 'An unexpected error occurred on the server.';


 res.status(err.statusCode || 500).json({ message });
};