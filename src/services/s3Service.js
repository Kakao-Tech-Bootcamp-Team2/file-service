const { s3, awsConfig } = require('../config/aws');
const { S3 } = require('../config/constants');
const { v4: uuidv4 } = require('uuid');

class S3Service {
  constructor() {
    this.s3 = s3;
    this.bucket = awsConfig.bucket;
  }

  /**
   * Pre-signed URL 생성
   */
  async generatePresignedUrl(fileInfo) {
    const { mimetype, userId } = fileInfo;
    const key = `${S3.UPLOAD_PATH}/${uuidv4()}`;
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: mimetype,
      Expires: S3.PRESIGNED_URL_EXPIRES
    };

    try {
      const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);
      const downloadUrl = `https://${this.bucket}.s3-accelerate.amazonaws.com/${key}`;
      
      return {
        uploadUrl,
        downloadUrl,
        key
      };
    } catch (error) {
      console.error('Failed to generate presigned URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  /**
   * 파일 삭제
   */
  async deleteFile(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Failed to delete file from S3:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * 파일 존재 여부 확인
   */
  async checkFileExists(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };

    try {
      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}

module.exports = new S3Service();