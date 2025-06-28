import { Request, Response } from 'express';
import { AdmissionService } from '../services/admission.service';
import { ApiResponse } from '../utils/apiResponse';

// 定义自定义错误接口
interface AppError extends Error {
  statusCode?: number;
}

export class AdmissionController {
  private admissionService: AdmissionService;

  constructor(admissionService?: AdmissionService) {
    this.admissionService = admissionService || new AdmissionService();
  }

  async getAdmissionStatus(req: Request, res: Response) {
    console.log('请求头:', req.headers);
    console.log('请求体:', req.body);
    
    // 检查请求体是否存在
    if (!req.body || Object.keys(req.body).length === 0) {
      return ApiResponse.error(res, 400, '请求体不能为空');
    }

    const { ksh, sfyzm } = req.body;
    
    if (!ksh || !sfyzm) {
      return ApiResponse.error(res, 400, '考生号和验证码不能为空');
    }

    try {
      const result = await this.admissionService.getAdmissionByKshAndSfyzm(ksh, sfyzm);
      
      if (typeof result === 'string') {
        return ApiResponse.error(res, 400, result);
      }
      
      return ApiResponse.success(res, result);
    } catch (error: unknown) { // 明确指定error为unknown类型
      if (error instanceof Error) {
        const appError = error as AppError;
        return ApiResponse.error(
          res, 
          appError.statusCode || 500, 
          appError.message || '服务器内部错误'
        );
      }
      return ApiResponse.error(res, 500, '未知错误');
    }
  }

  async deleteAdmission(req: Request, res: Response) {
    const { ksh } = req.params;
    
    if (!ksh) {
      return ApiResponse.error(res, 400, '考生号不能为空');
    }

    try {
      await this.admissionService.deleteAdmissionByKsh(ksh);
      return ApiResponse.success(res, { message: '删除成功' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ApiResponse.error(res, 400, error.message);
      }
      return ApiResponse.error(res, 500, '未知错误');
    }
  }

  async getAdmissionBatches(req: Request, res: Response) {
    console.log('收到POST /batches请求');
    const { key } = req.body;
    
    if (!key) {
      return ApiResponse.error(res, 400, 'key参数不能为空');
    }

    try {
      const batches = await this.admissionService.getAdmissionBatches(key);
      return ApiResponse.success(res, batches);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ApiResponse.error(res, 400, error.message);
      }
      return ApiResponse.error(res, 500, '未知错误');
    }
  }

  async batchImportAdmissions(req: Request, res: Response) {
    const { admissions, batchId } = req.body;
    
    if (!admissions || !batchId) {
      return ApiResponse.error(res, 400, '录取数据列表和批次ID不能为空');
    }

    try {
      const results = await this.admissionService.batchImportAdmissions(admissions, batchId);
      return ApiResponse.success(res, results);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return ApiResponse.error(res, 400, error.message);
      }
      return ApiResponse.error(res, 500, '未知错误');
    }
  }
}