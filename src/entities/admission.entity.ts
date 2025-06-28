import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Admission {
  @PrimaryColumn({ length: 30 })
  ksh!: string;

  @Column({ length: 30, nullable: true })
  zkzh!: string;

  @Column({ length: 30, nullable: true })
  sfzh!: string;

  @Column({ length: 100, nullable: true })
  xm!: string;

  @Column({ length: 10, nullable: true })
  xb!: string;

  @Column({ length: 30, nullable: true })
  lqzt!: string;

  @Column({ length: 30, nullable: true })
  ssmc!: string;

  @Column({ length: 255, nullable: true })
  pcmc!: string;

  @Column({ length: 50, nullable: true })
  klmc!: string;

  @Column({ length: 100, nullable: true })
  jhxz!: string;

  @Column({ length: 10, nullable: true })
  tdcj!: string;

  @Column({ length: 255, nullable: true })
  yxmc!: string;

  @Column({ length: 255, nullable: true })
  lqzymc!: string;

  @Column({ length: 255, nullable: true })
  xymc!: string;

  @Column({ length: 255, nullable: true })
  xqmc!: string;

  @Column({ length: 50, nullable: true })
  tzsbh!: string;

  @Column({ length: 50, nullable: true })
  emsdh!: string;

  @Column({ length: 4, nullable: true })
  sfyzm!: string;

  @Column({ length: 255, nullable: true })
  jtdz!: string;

  @Column({ length: 10, nullable: true })
  yzbm!: string;

  @Column({ length: 50, nullable: true })
  sjr!: string;

  @Column({ length: 20, nullable: true })
  sjh!: string;

  @Column({ length: 50, nullable: true })
  bdsj!: string;

  @Column({ length: 255, nullable: true })
  bz!: string;

  @Column({ default: 0 })
  cxcs!: number;

  @Column({ type: 'timestamp', nullable: true })
  last_update_time!: Date;

  @Column({ length: 36, nullable: true })
  import_batch_id!: string;

  @Column({ type: 'timestamp', nullable: true })
  import_time!: Date;
}