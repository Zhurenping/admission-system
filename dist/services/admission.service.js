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
exports.AdmissionService = void 0;
const admission_entity_1 = require("../entities/admission.entity");
const database_1 = require("../config/database");
class AdmissionService {
    constructor() {
        this.admissionRepository = database_1.AppDataSource.getRepository(admission_entity_1.Admission);
    }
    getAdmissionByKshAndSfyzm(ksh, sfyzm) {
        return __awaiter(this, void 0, void 0, function* () {
            // 先查询考生是否存在
            const admission = yield this.admissionRepository.findOne({
                where: { ksh }
            });
            if (!admission) {
                return "没有匹配的录取信息";
            }
            // 检查验证码
            if (admission.sfyzm !== sfyzm) {
                return "验证码错误";
            }
            // 更新查询次数
            admission.cxcs = (admission.cxcs || 0) + 1;
            yield this.admissionRepository.save(admission);
            // 返回完整录取信息
            return {
                ksh: admission.ksh,
                xm: admission.xm,
                xb: admission.xb,
                lqzt: admission.lqzt,
                lqzymc: admission.lqzymc,
                xymc: admission.xymc,
                xqmc: admission.xqmc,
                tzsbh: admission.tzsbh,
                yxmc: admission.yxmc,
                jtdz: admission.jtdz,
                yzbm: admission.yzbm,
                sjr: admission.sjr,
                cxcs: admission.cxcs,
                tdcj: admission.tdcj,
                klmc: admission.klmc,
                bdsj: admission.bdsj
            };
        });
    }
    deleteAdmissionByKsh(ksh) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.admissionRepository.delete({ ksh });
            if (result.affected === 0) {
                throw new Error('找不到对应的考生记录');
            }
        });
    }
    getAdmissionBatches() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const batches = yield this.admissionRepository.createQueryBuilder()
                    .select(['DISTINCT SSMC as ssmc', 'PCMC as pcmc', 'KLMC as klmc', 'JHXZ as jhxz'])
                    .orderBy('SSMC')
                    .addOrderBy('PCMC')
                    .addOrderBy('KLMC')
                    .addOrderBy('JHXZ')
                    .getRawMany();
                if (!batches || batches.length === 0) {
                    throw new Error('没有找到任何录取批次数据');
                }
                return batches.map((batch, index) => ({
                    id: index + 1,
                    pc: `${batch.ssmc.trim()}-${batch.pcmc.trim()}-${batch.klmc.trim()}-${batch.jhxz.trim()}`
                }));
            }
            catch (error) {
                console.error('获取录取批次数据失败:', error);
                throw error;
            }
        });
    }
    batchImportAdmissions(admissions, batchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const admission of admissions) {
                try {
                    // 先尝试更新
                    const updateResult = yield this.admissionRepository.update({ ksh: admission.ksh }, Object.assign(Object.assign({}, admission), { import_batch_id: batchId, import_time: new Date() }));
                    if (updateResult.affected === 0) {
                        // 更新失败则创建
                        const newAdmission = this.admissionRepository.create(Object.assign(Object.assign({}, admission), { import_batch_id: batchId, import_time: new Date() }));
                        yield this.admissionRepository.save(newAdmission);
                        results.push({ ksh: admission.ksh, status: 'created' });
                    }
                    else {
                        results.push({ ksh: admission.ksh, status: 'updated' });
                    }
                }
                catch (error) {
                    results.push({
                        ksh: admission.ksh,
                        status: 'error',
                        error: error instanceof Error ? error.message : '未知错误'
                    });
                }
            }
            return results;
        });
    }
}
exports.AdmissionService = AdmissionService;
