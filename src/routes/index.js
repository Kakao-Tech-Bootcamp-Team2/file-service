const express = require('express');
const router = express.Router();
const fileRoutes = require('./fileRoutes');

// 상태 확인 라우트
router.get('/health', (req, res) => {
  res.json({
    status: 'active',
    service: 'file-service',
    timestamp: new Date().toISOString()
  });
});

// API 문서 라우트
router.get('/', (req, res) => {
  res.json({
    name: 'File Service API',
    version: '1.0.0',
    endpoints: {
      '/upload/init': 'POST - 파일 업로드 초기화 (Pre-signed URL 발급)',
      '/upload/complete/:uploadId': 'POST - 파일 업로드 완료 확인',
      '/files/:fileId': 'GET - 파일 정보 조회',
      '/files/:fileId': 'DELETE - 파일 삭제'
    }
  });
});

// 파일 라우트 마운트
router.use('/', fileRoutes);

module.exports = router;