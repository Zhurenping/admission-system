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
exports.AdmissionController = void 0;
const admission_service_1 = require("../services/admission.service");
const apiResponse_1 = require("../utils/apiResponse");
class AdmissionController {
    constructor(admissionService) {
        this.admissionService = admissionService || new admission_service_1.AdmissionService();
    }
    getAdmissionStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ksh, sfyzm } = req.body;
            if (!ksh || !sfyzm) {
                return apiResponse_1.ApiResponse.error(res, 400, '考生号和验证码不能为空');
            }
            try {
                const result = yield this.admissionService.getAdmissionByKshAndSfyzm(ksh, sfyzm);
                if (typeof result === 'string') {
                    return apiResponse_1.ApiResponse.error(res, 400, result);
                }
                return apiResponse_1.ApiResponse.success(res, result);
            }
            catch (error) { // 明确指定error为unknown类型
                if (error instanceof Error) {
                    const appError = error;
                    return apiResponse_1.ApiResponse.error(res, appError.statusCode || 500, appError.message || '服务器内部错误');
                }
                return apiResponse_1.ApiResponse.error(res, 500, '未知错误');
            }
        });
    }
    deleteAdmission(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ksh } = req.params;
            if (!ksh) {
                return apiResponse_1.ApiResponse.error(res, 400, '考生号不能为空');
            }
            try {
                yield this.admissionService.deleteAdmissionByKsh(ksh);
                return apiResponse_1.ApiResponse.success(res, { message: '删除成功' });
            }
            catch (error) {
                if (error instanceof Error) {
                    return apiResponse_1.ApiResponse.error(res, 400, error.message);
                }
                return apiResponse_1.ApiResponse.error(res, 500, '未知错误');
            }
        });
    }
    getAdmissionBatches(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const batches = yield this.admissionService.getAdmissionBatches();
                return apiResponse_1.ApiResponse.success(res, batches);
            }
            catch (error) {
                if (error instanceof Error) {
                    return apiResponse_1.ApiResponse.error(res, 400, error.message);
                }
                return apiResponse_1.ApiResponse.error(res, 500, '未知错误');
            }
        });
    }
    batchImportAdmissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { admissions, batchId } = req.body;
            if (!admissions || !batchId) {
                return apiResponse_1.ApiResponse.error(res, 400, '录取数据列表和批次ID不能为空');
            }
            try {
                const results = yield this.admissionService.batchImportAdmissions(admissions, batchId);
                return apiResponse_1.ApiResponse.success(res, results);
            }
            catch (error) {
                if (error instanceof Error) {
                    return apiResponse_1.ApiResponse.error(res, 400, error.message);
                }
                return apiResponse_1.ApiResponse.error(res, 500, '未知错误');
            }
        });
    }
}
exports.AdmissionController = AdmissionController;
