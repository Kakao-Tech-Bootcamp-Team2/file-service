const { upload } = require('../config/keys');
const { IMAGE_TYPES, VIDEO_TYPES, AUDIO_TYPES } = require('../config/constants');

exports.validateFileUpload = (req, res, next) => {
  const { originalname, mimetype, size } = req.body;
  const errors = [];

  // 필수 필드 검증
  if (!originalname?.trim()) {
    errors.push('파일명은 필수입니다.');
  }

  if (!mimetype) {
    errors.push('파일 타입은 필수입니다.');
  }

  if (!size || size <= 0) {
    errors.push('올바른 파일 크기가 필요합니다.');
  }

  // MIME 타입 검증
  const isAllowedType = Object.keys(upload.allowedMimeTypes).includes(mimetype);
  if (!isAllowedType) {
    errors.push('지원하지 않는 파일 형식입니다.');
  }

  // 파일 확장자 검증
  const extension = originalname.split('.').pop().toLowerCase();
  const allowedExtensions = upload.allowedMimeTypes[mimetype] || [];
  if (!allowedExtensions.includes(`.${extension}`)) {
    errors.push('파일 확장자가 올바르지 않습니다.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: '파일 유효성 검사 실패',
      errors
    });
  }

  next();
};

exports.validateUploadComplete = (req, res, next) => {
  const { uploadId } = req.params;

  if (!uploadId?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Upload ID가 누락되었습니다.'
    });
  }

  next();
};

exports.validateFileId = (req, res, next) => {
  const { fileId } = req.params;

  if (!fileId?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'File ID가 누락되었습니다.'
    });
  }

  next();
};