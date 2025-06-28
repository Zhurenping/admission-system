import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

interface AppError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? '服务器内部错误' : err.message;
  
  ApiResponse.error(res, statusCode, message);
};