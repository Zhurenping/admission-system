import express from 'express';
import 'reflect-metadata';
import { AppDataSource, initializeDatabase } from './config/database';
import admissionRoutes from './routes/admission.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

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
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      console.log('JSON中间件处理后请求体:', req.body);
      next();
    });
    
    // 严格CORS配置
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Requested-With'],
      credentials: true,
      exposedHeaders: ['Set-Cookie']
    }));

    // 调整安全头部配置以适应前端需求
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'"],
          "style-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
          "img-src": ["'self'", "data:"],
          "font-src": ["'self'", "https://cdn.jsdelivr.net"],
          "connect-src": ["'self'"]
        }
      },
      xssFilter: true,
      noSniff: true,
      hidePoweredBy: true
    }));

    // 开发环境完全禁用CSRF保护
    if (process.env.NODE_ENV === 'production') {
      const csrf = require('csurf');
      const csrfProtection = csrf({
        cookie: {
          key: '_csrf',
          secure: true,
          sameSite: 'none',
          httpOnly: true
        }
      });
      this.app.use('/api', csrfProtection);
      
      // 提供CSRF令牌端点
      this.app.get('/api/csrf-token', (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
      });
    } else {
      console.warn('开发环境已禁用CSRF保护');
    }

    // 提供CSRF令牌端点
    this.app.get('/api/csrf-token', (req, res) => {
      const token = Math.random().toString(36).substring(2);
      res.cookie('_csrf', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      res.json({ csrfToken: token });
    });
    
    // 提供CSRF令牌端点(带调试信息)
    this.app.get('/api/csrf-token', (req, res) => {
      const token = req.csrfToken();
      console.log('生成CSRF Token:', {
        token: token,
        cookie: req.cookies._csrf,
        headers: req.headers
      });
      res.cookie('XSRF-TOKEN', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      res.json({
        csrfToken: token,
        debug: process.env.NODE_ENV === 'development' ? {
          cookieName: '_csrf',
          headerName: 'X-CSRF-Token'
        } : undefined
      });
    });
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