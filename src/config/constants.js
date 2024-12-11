module.exports = {
    // Redis 키 패턴
    REDIS_KEYS: {
      FILE_UPLOAD: 'file:upload:', // file:upload:{uploadId}
      FILE_META: 'file:meta:',     // file:meta:{fileId}
    },
  
    // Redis TTL 설정
    REDIS_TTL: {
      UPLOAD_INFO: 60 * 60,     // 업로드 정보 1시간 유지
      FILE_META: 60 * 60 * 24,  // 파일 메타데이터 24시간 유지
    },
  
    // 파일 업로드 상태
    UPLOAD_STATUS: {
      INITIATED: 'initiated',    // Pre-signed URL 발급됨
      COMPLETED: 'completed',    // S3 업로드 완료
      FAILED: 'failed'          // 업로드 실패
    },
  
    // S3 설정
    S3: {
      PRESIGNED_URL_EXPIRES: 5 * 60,  // Pre-signed URL 5분 유효
      UPLOAD_PATH: 'uploads',         // S3 업로드 기본 경로
    },
  
    // 이미지 타입
    IMAGE_TYPES: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
  
    // 비디오 타입
    VIDEO_TYPES: [
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ],
  
    // 오디오 타입
    AUDIO_TYPES: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg'
    ]
  };