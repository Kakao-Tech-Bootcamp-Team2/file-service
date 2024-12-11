const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
  
    // 클라이언트 에러 (400번대)
    if (err.status >= 400 && err.status < 500) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      });
    }
  
    // AWS S3 관련 에러
    if (err.code?.startsWith('AWS')) {
      return res.status(500).json({
        success: false,
        message: '파일 저장소 처리 중 오류가 발생했습니다.'
      });
    }
  
    // Redis 관련 에러
    if (err.name === 'RedisError') {
      return res.status(500).json({
        success: false,
        message: '캐시 처리 중 오류가 발생했습니다.'
      });
    }
  
    // 기본 서버 에러 응답
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  };
  
  module.exports = errorHandler;