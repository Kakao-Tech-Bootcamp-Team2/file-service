/**
 * Redis에 저장될 파일 업로드 정보의 타입 정의
 */

const { UPLOAD_STATUS } = require('../config/constants');

class FileUploadInfo {
  constructor({
    uploadId,
    originalname,
    mimetype,
    size,
    userId,
    key,
    status = UPLOAD_STATUS.INITIATED
  }) {
    this.uploadId = uploadId;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
    this.userId = userId;
    this.key = key;
    this.status = status;
    this.createdAt = Date.now();
  }

  // Redis에 저장하기 위한 직렬화
  toRedis() {
    return JSON.stringify({
      uploadId: this.uploadId,
      originalname: this.originalname,
      mimetype: this.mimetype,
      size: this.size,
      userId: this.userId,
      key: this.key,
      status: this.status,
      createdAt: this.createdAt
    });
  }

  // Redis에서 불러온 데이터 파싱
  static fromRedis(data) {
    if (!data) return null;
    const parsed = JSON.parse(data);
    return new FileUploadInfo(parsed);
  }

  // 유효성 검사
  validate() {
    if (!this.uploadId) throw new Error('Upload ID is required');
    if (!this.originalname) throw new Error('Original filename is required');
    if (!this.mimetype) throw new Error('Mimetype is required');
    if (!this.size || this.size <= 0) throw new Error('Valid file size is required');
    if (!this.userId) throw new Error('User ID is required');
    if (!this.key) throw new Error('S3 key is required');
    return true;
  }
}

class FileMetadata {
  constructor({
    fileId,
    originalname,
    mimetype,
    size,
    userId,
    key,
    url,
    uploadId
  }) {
    this.fileId = fileId;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.size = size;
    this.userId = userId;
    this.key = key;
    this.url = url;
    this.uploadId = uploadId;
    this.createdAt = Date.now();
  }

  // Redis에 저장하기 위한 직렬화
  toRedis() {
    return JSON.stringify({
      fileId: this.fileId,
      originalname: this.originalname,
      mimetype: this.mimetype,
      size: this.size,
      userId: this.userId,
      key: this.key,
      url: this.url,
      uploadId: this.uploadId,
      createdAt: this.createdAt
    });
  }

  // Redis에서 불러온 데이터 파싱
  static fromRedis(data) {
    if (!data) return null;
    const parsed = JSON.parse(data);
    return new FileMetadata(parsed);
  }

  // 파일 응답 형식으로 변환 (프론트엔드 호환성 유지)
  toResponse() {
    return {
      id: this.fileId,
      originalname: this.originalname,
      filename: this.key.split('/').pop(),
      mimetype: this.mimetype,
      size: this.size,
      url: this.url,
      createdAt: this.createdAt
    };
  }

  // 유효성 검사
  validate() {
    if (!this.fileId) throw new Error('File ID is required');
    if (!this.originalname) throw new Error('Original filename is required');
    if (!this.mimetype) throw new Error('Mimetype is required');
    if (!this.size || this.size <= 0) throw new Error('Valid file size is required');
    if (!this.userId) throw new Error('User ID is required');
    if (!this.key) throw new Error('S3 key is required');
    if (!this.url) throw new Error('File URL is required');
    return true;
  }
}

module.exports = {
  FileUploadInfo,
  FileMetadata
};