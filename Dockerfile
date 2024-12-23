# 베이스 이미지 설정
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사
COPY package*.json ./

# 프로덕션 의존성만 설치
RUN npm install --omit=dev

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3002

# 헬스체크를 위한 포트 노출
EXPOSE 3002

# 애플리케이션 실행
CMD ["npm", "start"]