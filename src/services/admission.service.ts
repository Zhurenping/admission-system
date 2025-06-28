import { Admission } from '../entities/admission.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';

export class AdmissionService {
  private admissionRepository: Repository<Admission>;

  constructor() {
    this.admissionRepository = AppDataSource.getRepository(Admission);
  }

  async getAdmissionByKshAndSfyzm(ksh: string, sfyzm: string): Promise<any | string> {
    // 先查询考生是否存在
    const admission = await this.admissionRepository.findOne({
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
    await this.admissionRepository.save(admission);

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
      emsdh: admission.emsdh,
      yxmc: admission.yxmc,
      jtdz: admission.jtdz,
      yzbm: admission.yzbm,
      sjr: admission.sjr,
      sjh: admission.sjh,
      cxcs: admission.cxcs,
      tdcj: admission.tdcj,
      klmc: admission.klmc,
      bdsj: admission.bdsj
    };
  }

  async deleteAdmissionByKsh(ksh: string): Promise<void> {
    const result = await this.admissionRepository.delete({ ksh });
    if (result.affected === 0) {
      throw new Error('找不到对应的考生记录');
    }
  }

  async getAdmissionBatches(key: string): Promise<Array<{
    id: number;
    pc: string;
  }>> {
    if (!key || key !== "youngpig") {
      throw new Error('无效的key参数');
    }
    try {
      const batches = await this.admissionRepository.createQueryBuilder()
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
    } catch (error) {
      console.error('获取录取批次数据失败:', error);
      throw error;
    }
  }

  async batchImportAdmissions(admissions: Admission[], batchId: string) {
    const results: Array<{
      ksh: string;
      status: 'created' | 'updated' | 'error';
      error?: string;
    }> = [];

    for (const admission of admissions) {
      try {
        // 先尝试更新
        const updateResult = await this.admissionRepository.update(
          { ksh: admission.ksh },
          {
            ...admission,
            import_batch_id: batchId,
            import_time: new Date()
          }
        );

        if (updateResult.affected === 0) {
          // 更新失败则创建
          const newAdmission = this.admissionRepository.create({
            ...admission,
            import_batch_id: batchId,
            import_time: new Date()
          });
          await this.admissionRepository.save(newAdmission);
          results.push({ ksh: admission.ksh, status: 'created' });
        } else {
          results.push({ ksh: admission.ksh, status: 'updated' });
        }
      } catch (error: unknown) {
        results.push({
          ksh: admission.ksh,
          status: 'error',
          error: error instanceof Error ? error.message : '未知错误'
        });
      }
    }

    return results;
  }
}