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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
exports.initializeDatabase = initializeDatabase;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const admission_entity_1 = require("../entities/admission.entity");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [admission_entity_1.Admission],
    migrations: [],
    subscribers: [],
    extra: {
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        max: 20
    }
});
// 带重试的数据库初始化函数
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let retries = 5;
        while (retries) {
            try {
                yield exports.AppDataSource.initialize();
                console.log('数据库连接成功');
                return;
            }
            catch (err) {
                retries -= 1;
                console.log(`数据库连接失败，剩余重试次数: ${retries}`, err);
                if (retries === 0) {
                    throw err;
                }
                yield new Promise(res => setTimeout(res, 3000));
            }
        }
    });
}
