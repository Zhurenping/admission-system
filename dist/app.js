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
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const database_1 = require("./config/database");
const admission_routes_1 = __importDefault(require("./routes/admission.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: Object.assign(Object.assign({}, helmet_1.default.contentSecurityPolicy.getDefaultDirectives()), { "script-src": ["'self'", "'unsafe-inline'"] })
            }
        }));
        this.app.use((0, morgan_1.default)('combined'));
        this.app.use(express_1.default.static('public'));
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, database_1.initializeDatabase)();
                return true;
            }
            catch (error) {
                console.error('数据库连接失败:', error);
                process.exit(1);
            }
        });
    }
    initializeRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            // 确保数据库连接成功后再注册路由
            yield this.initializeDatabase();
            this.app.use('/api/admission', admission_routes_1.default);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initializeRoutes();
            this.listen();
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`服务器运行在 http://localhost:${this.port}`);
        });
    }
}
exports.default = App;
