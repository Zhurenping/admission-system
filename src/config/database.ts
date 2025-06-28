import "reflect-metadata";
import { DataSource } from "typeorm";
import { Admission } from "../entities/admission.entity";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Admission],
  migrations: [],
  subscribers: [],
  extra: {
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20
  }
});

// 带重试的数据库初始化函数
export async function initializeDatabase() {
  let retries = 5;
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log('数据库连接成功');
      return;
    } catch (err) {
      retries -= 1;
      console.log(`数据库连接失败，剩余重试次数: ${retries}`, err);
      if (retries === 0) {
        throw err;
      }
      await new Promise(res => setTimeout(res, 3000));
    }
  }
}