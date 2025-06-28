import express from 'express';
import 'reflect-metadata';
import { AppDataSource, initializeDatabase } from './config/database';
import admissionRoutes from './routes/admission.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use((req, res, next) => {
      console.log('收到请求:', req.method, req.url);
      console.log('请求头:', req.headers);
      next();
    });
    
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      console.log('JSON中间件处理后请求体:', req.body);
      next();
    });
    
    this.app.use(cors());
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'"]
        }
      }
    }));
    this.app.use(morgan('combined'));
    this.app.use(express.static('public'));
  }

  private async initializeDatabase() {
    try {
      await initializeDatabase();
      return true;
    } catch (error) {
      console.error('数据库连接失败:', error);
      process.exit(1);
    }
  }

  private async initializeRoutes() {
    // 确保数据库连接成功后再注册路由
    await this.initializeDatabase();
    this.app.use('/api/admission', admissionRoutes);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public async start() {
    await this.initializeRoutes();
    this.listen();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`服务器运行在 http://localhost:${this.port}`);
    });
  }
}

export default App;