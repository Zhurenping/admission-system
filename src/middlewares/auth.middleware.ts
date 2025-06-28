import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';

const API_KEYS = new Set(process.env.API_KEYS?.split(',') || []);

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    const error = new Error('API密钥缺失');
    (error as any).statusCode = 401;
    return next(error);
  }

  if (!API_KEYS.has(apiKey)) {
    const error = new Error('无效的API密钥');
    (error as any).statusCode = 403;
    return next(error);
  }

  next();
}