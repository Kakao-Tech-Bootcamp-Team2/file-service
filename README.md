# File Service

파일 업로드 및 관리를 위한 마이크로서비스

## 주요 기능

### 1. 파일 업로드
- S3 Pre-signed URL을 통한 클라이언트 직접 업로드 지원
- 다양한 파일 형식 지원:
  - 이미지 (jpg, jpeg, png, gif, webp)
  - 비디오 (mp4, webm, mov)
  - 오디오 (mp3, wav, ogg)
  - 문서 (pdf)
- S3 Transfer Acceleration을 통한 빠른 업로드 속도

### 2. 파일 관리
- 파일 메타데이터 관리
- 파일 정보 조회
- 파일 삭제

### 3. 보안
- JWT 기반 인증
- 파일 접근 권한 관리
- CORS 설정

### 4. 캐싱
- Redis를 활용한 파일 메타데이터 캐싱
- 업로드 상태 추적