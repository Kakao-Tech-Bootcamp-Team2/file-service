const fileService = require('../services/fileService');

const fileController = {
  /**
   * 파일 업로드 초기화 (Pre-signed URL 발급)
   */
  async initiateUpload(req, res, next) {
    try {
      const { originalname, mimetype, size } = req.body;
      const userId = req.user.id;

      const uploadInfo = await fileService.initiateUpload({
        originalname,
        mimetype,
        size,
        userId
      });

      res.json({
        success: true,
        data: {
          uploadId: uploadInfo.uploadId,
          uploadUrl: uploadInfo.uploadUrl,
          key: uploadInfo.key
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 파일 업로드 완료 확인
   */
  async completeUpload(req, res, next) {
    try {
      const { uploadId } = req.params;
      const userId = req.user.id;

      const fileInfo = await fileService.completeUpload(uploadId, userId);

      res.json({
        success: true,
        data: {
          file: fileInfo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 파일 정보 조회
   */
  async getFileInfo(req, res, next) {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;

      const fileInfo = await fileService.getFileInfo(fileId, userId);

      res.json({
        success: true,
        data: {
          file: fileInfo
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 파일 삭제
   */
  async deleteFile(req, res, next) {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;

      await fileService.deleteFile(fileId, userId);

      res.json({
        success: true,
        message: '파일이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 에러 응답 생성
   */
  handleError(res, error) {
    console.error('File controller error:', error);
    
    // 클라이언트 에러 (400번대)
    if (error.status >= 400 && error.status < 500) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }

    // 서버 에러 (500번대)
    res.status(500).json({
      success: false,
      message: '파일 처리 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = fileController;