import { Router } from 'express';
import { AdmissionController } from '../controllers/admission.controller';
import { AdmissionService } from '../services/admission.service';
import { asyncHandler } from '../utils/asyncHandler';
import { initializeDatabase } from '../config/database';
// 将类型声明直接合并到当前文件
declare global {
  namespace Express {
    interface Request {
      admissionController: AdmissionController;
    }
  }
}

const router = Router();

// 使用立即执行函数初始化服务
const admissionControllerPromise = (async () => {
  await initializeDatabase();
  const admissionService = new AdmissionService();
  return new AdmissionController(admissionService);
})();

// 确保服务初始化完成的中间件
router.use(asyncHandler(async (req, res, next) => {
  req.admissionController = await admissionControllerPromise;
  next();
}));

// 健康检查端点
router.get('/health', asyncHandler(async (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'API服务运行正常',
    timestamp: new Date().toISOString()
  });
}));

// 考生查询端点 (POST /query)
router.post('/query', asyncHandler(async (req, res) => {
  await req.admissionController.getAdmissionStatus(req, res);
}));

// 根据考生号查询录取信息 (GET /:ksh)
router.get('/:ksh', asyncHandler(async (req, res) => {
  await req.admissionController.getAdmissionStatus(req, res);
}));

// 删除考生录取信息(招办使用)
router.delete('/:ksh', asyncHandler(async (req, res) => {
  await req.admissionController.deleteAdmission(req, res);
}));

// 查询录取批次清单 (改为POST请求)
router.post('/batches', asyncHandler(async (req, res) => {
  console.log('匹配到POST /batches路由');
  await req.admissionController.getAdmissionBatches(req, res);
}));

// 批量导入录取数据(招办使用)
router.post('/admin/import', asyncHandler(async (req, res) => {
  await req.admissionController.batchImportAdmissions(req, res);
}));

export default router;