const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middleware/error');

const app = express();

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(compression()); // 응답 압축
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅 설정
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 헬스체크
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'file-service',
    timestamp: new Date().toISOString()
  });
});

// 라우트 설정
app.use('/api/v1', routes);

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스�� 찾을 수 없습니다.'
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
const PORT = process.env.PORT || 3002;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`File Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// 프로세스 에러 핸들링
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();

module.exports = app;