import { Request, Response, NextFunction } from 'express';

export function logger2(req: Request, res: Response, next: NextFunction) {
  console.log(`Request2...`);
  next();
}
