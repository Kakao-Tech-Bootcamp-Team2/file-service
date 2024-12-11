const { v4: uuidv4 } = require('uuid');
const s3Service = require('./s3Service');
const redisClient = require('../config/redis');
const { FileUploadInfo, FileMetadata } = require('../models/fileTypes');
const { REDIS_KEYS, REDIS_TTL, UPLOAD_STATUS } = require('../config/constants');

class FileService {
  /**
   * 파일 업로드 초기화
   */
  async initiateUpload(fileInfo) {
    const uploadId = uuidv4();
    
    try {
      // S3 Pre-signed URL 생성
      const { uploadUrl, downloadUrl, key } = await s3Service.generatePresignedUrl(fileInfo);

      // 업로드 정보 생성
      const uploadInfo = new FileUploadInfo({
        uploadId,
        originalname: fileInfo.originalname,
        mimetype: fileInfo.mimetype,
        size: fileInfo.size,
        userId: fileInfo.userId,
        key
      });

      // Redis에 업로드 정보 저장
      await redisClient.setex(
        REDIS_KEYS.FILE_UPLOAD + uploadId,
        REDIS_TTL.UPLOAD_INFO,
        uploadInfo.toRedis()
      );

      return {
        uploadId,
        uploadUrl,
        downloadUrl,
        key
      };
    } catch (error) {
      console.error('Failed to initiate upload:', error);
      throw new Error('Failed to initiate file upload');
    }
  }

  /**
   * 파일 업로드 완료 처리
   */
  async completeUpload(uploadId, userId) {
    try {
      // Redis에서 업로드 정보 조회
      const uploadData = await redisClient.get(REDIS_KEYS.FILE_UPLOAD + uploadId);
      if (!uploadData) {
        throw new Error('Upload information not found');
      }

      const uploadInfo = FileUploadInfo.fromRedis(uploadData);
      
      // 사용자 검증
      if (uploadInfo.userId !== userId) {
        throw new Error('Unauthorized access to upload');
      }

      // S3 파일 존재 여부 확인
      const fileExists = await s3Service.checkFileExists(uploadInfo.key);
      if (!fileExists) {
        throw new Error('File not found in S3');
      }

      // 파일 메타데이터 생성
      const fileId = uuidv4();
      const fileMetadata = new FileMetadata({
        fileId,
        originalname: uploadInfo.originalname,
        mimetype: uploadInfo.mimetype,
        size: uploadInfo.size,
        userId: uploadInfo.userId,
        key: uploadInfo.key,
        url: `https://${s3Service.bucket}.s3.${awsConfig.region}.amazonaws.com/${uploadInfo.key}`,
        uploadId
      });

      // Redis에 파일 메타데이터 저장
      await redisClient.setex(
        REDIS_KEYS.FILE_META + fileId,
        REDIS_TTL.FILE_META,
        fileMetadata.toRedis()
      );

      // 업로드 정보 상태 업데이트
      uploadInfo.status = UPLOAD_STATUS.COMPLETED;
      await redisClient.setex(
        REDIS_KEYS.FILE_UPLOAD + uploadId,
        REDIS_TTL.UPLOAD_INFO,
        uploadInfo.toRedis()
      );

      return fileMetadata.toResponse();
    } catch (error) {
      console.error('Failed to complete upload:', error);
      throw new Error('Failed to complete file upload');
    }
  }

  /**
   * 파일 삭제
   */
  async deleteFile(fileId, userId) {
    try {
      // Redis에서 파일 메타데이터 조회
      const fileData = await redisClient.get(REDIS_KEYS.FILE_META + fileId);
      if (!fileData) {
        throw new Error('File not found');
      }

      const fileMetadata = FileMetadata.fromRedis(fileData);
      
      // 사용자 검증
      if (fileMetadata.userId !== userId) {
        throw new Error('Unauthorized access to file');
      }

      // S3에서 파일 삭제
      await s3Service.deleteFile(fileMetadata.key);

      // Redis에서 메타데이터 삭제
      await redisClient.del(REDIS_KEYS.FILE_META + fileId);

      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * 파일 정보 조회
   */
  async getFileInfo(fileId, userId) {
    try {
      const fileData = await redisClient.get(REDIS_KEYS.FILE_META + fileId);
      if (!fileData) {
        throw new Error('File not found');
      }

      const fileMetadata = FileMetadata.fromRedis(fileData);
      
      // 사용자 검증
      if (fileMetadata.userId !== userId) {
        throw new Error('Unauthorized access to file');
      }

      return fileMetadata.toResponse();
    } catch (error) {
      console.error('Failed to get file info:', error);
      throw new Error('Failed to get file information');
    }
  }
}

module.exports = new FileService();