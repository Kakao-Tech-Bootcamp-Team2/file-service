require('dotenv').config();

module.exports = {
  // JWT 검증용 시크릿 키
  jwtSecret: process.env.JWT_SECRET,
  
  // S3 관련 설정
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_S3_BUCKET,
    cloudfront: {
      domain: process.env.CLOUDFRONT_DOMAIN,
      enabled: process.env.USE_CLOUDFRONT === 'true'
    }
  },

  // 파일 업로드 제한 설정
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 1024 * 1024 * 5, // 기본 5MB
    allowedMimeTypes: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'application/pdf': ['.pdf']
    }
  }
};