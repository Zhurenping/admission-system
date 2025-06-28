"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admission_controller_1 = require("../controllers/admission.controller");
const admission_service_1 = require("../services/admission.service");
const asyncHandler_1 = require("../utils/asyncHandler");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// 使用立即执行函数初始化服务
const admissionControllerPromise = (() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.initializeDatabase)();
    const admissionService = new admission_service_1.AdmissionService();
    return new admission_controller_1.AdmissionController(admissionService);
}))();
// 确保服务初始化完成的中间件
router.use((0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.admissionController = yield admissionControllerPromise;
    next();
})));
// 健康检查端点
router.get('/health', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: 'API服务运行正常',
        timestamp: new Date().toISOString()
    });
})));
// 考生查询端点 (POST /query)
router.post('/query', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield req.admissionController.getAdmissionStatus(req, res);
})));
// 根据考生号查询录取信息 (GET /:ksh)
router.get('/:ksh', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield req.admissionController.getAdmissionStatus(req, res);
})));
// 删除考生录取信息(招办使用)
router.delete('/:ksh', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield req.admissionController.deleteAdmission(req, res);
})));
// 查询录取批次清单
router.get('/batches', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield req.admissionController.getAdmissionBatches(req, res);
})));
// 批量导入录取数据(招办使用)
router.post('/admin/import', (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield req.admissionController.batchImportAdmissions(req, res);
})));
exports.default = router;
