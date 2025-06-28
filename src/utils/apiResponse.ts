import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data
    });
  }

  static error(res: Response, statusCode: number, message: string) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }
}