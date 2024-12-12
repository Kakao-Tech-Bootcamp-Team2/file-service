const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const { validateFileUpload, validateUploadComplete, validateFileId } = require('../middleware/validator');

// 파일 업로드 초기화 (Pre-signed URL 발급)
router.post('/upload/init',
  auth,
  validateFileUpload,
  fileController.initiateUpload
);

// 파일 업로드 완료 확인
router.post('/upload/complete/:uploadId',
  auth,
  validateUploadComplete,
  fileController.completeUpload
);

// 파일 정보 조회
router.get('/files/:fileId',
  auth,
  validateFileId,
  fileController.getFileInfo
);

// 파일 삭제
router.delete('/files/:fileId',
  auth,
  validateFileId,
  fileController.deleteFile
);

// 에러 핸들러
router.use((err, req, res, next) => {
  next(err);
});

module.exports = router;