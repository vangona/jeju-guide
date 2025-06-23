# AI 챗봇 개발 가이드

## 개발 환경 설정

### 1. 개발 서버 실행
```bash
# React 앱과 API 서버를 동시에 실행
yarn dev

# 또는 각각 실행
# 터미널 1
yarn start

# 터미널 2
yarn dev:api
```

### 2. API 테스트
- React 앱: http://localhost:3000
- API 서버: http://localhost:3001/api/ai-chat

### 3. OpenAI API 키 입력
1. 🤖 버튼 클릭하여 AI 챗봇 열기
2. ⚙️ 버튼 클릭하여 API 키 설정
3. OpenAI API 키 입력 후 저장

### 4. 프로덕션 배포
- Vercel 배포 시 `/api` 폴더의 함수가 자동으로 서버리스 함수로 배포됨
- 환경 변수 설정 불필요 (사용자가 직접 API 키 입력)

## 주요 파일
- `/src/components/AIChat.tsx`: AI 챗봇 UI 컴포넌트
- `/api/ai-chat.js`: Vercel 서버리스 함수 (프로덕션)
- `/scripts/dev-api.js`: 로컬 개발 서버 (개발용)

## 기능
- 사용자가 직접 OpenAI API 키 입력
- 제주도 여행 관련 질문에 대한 AI 응답
- 자동 스크롤
- 모바일 반응형 디자인