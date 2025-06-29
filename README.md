# 제주 가이드 🏝️

AI 기반 맞춤형 제주도 여행 가이드 웹 애플리케이션입니다. 7개월간의 제주도 장기여행과 5년간의 거주 경험을 바탕으로 엄선한 맛집, 카페, 풍경 명소를 소개하며, AI 어시스턴트가 개인화된 여행 추천을 제공합니다.

## 🌟 주요 기능

### 1. AI 여행 어시스턴트 🤖

<img width="1062" alt="스크린샷 2025-06-29 오후 5 38 34" src="https://github.com/user-attachments/assets/e08caf47-3641-4bad-a894-264f7b003d04" />

- **스마트 대화형 AI**: OpenAI GPT 기반의 제주도 전문 AI 어시스턴트
- **RAG (Retrieval-Augmented Generation)**: 실제 데이터베이스 기반 정확한 장소 추천
- **벡터 검색**: Pinecone을 활용한 의미 기반 장소 검색
- **세션 관리**: 최대 10개의 대화 저장 및 불러오기
- **스타터 프롬프트**: 상황별 맞춤 질문 템플릿
  - 제주 처음 방문자를 위한 가이드
  - 현지인만 아는 숨은 명소
  - 테마별 여행 코스 추천

### 2. 장소 탐색
- **지도 보기**: 제주도 전체 지도에서 추천 장소를 마커로 확인

<img width="1440" alt="스크린샷 2025-06-29 오후 5 57 34" src="https://github.com/user-attachments/assets/ebf44eee-58b3-43f1-8206-1a5920c26047" />

- **목록 보기**: 카드 또는 테이블 형식으로 장소 목록 확인
- **상세 정보**: 각 장소의 사진, 설명, 주소, 운영시간 등 상세 정보 제공
- **이미지 갤러리**: Swiper.js를 활용한 고품질 이미지 슬라이더

### 3. 검색 및 필터
- **통합 검색**: 장소명, 주소, 설명으로 검색
- **AI 기반 시맨틱 검색**: 의미 기반 검색으로 더 정확한 결과
- **카테고리 필터**: 맛집, 카페, 풍경, 술집, 숙소 등
- **정렬 옵션**: 인기순, 최신순, 거리순

### 4. 개인화 기능
- **나만의 장소**: 마음에 드는 장소 저장 및 관리
- **API 키 관리**: 개인 OpenAI API 키로 AI 기능 사용
- **대화 히스토리**: AI와의 대화 내역 저장 및 관리

### 5. 여행 팁
- 제주도 대중교통 완벽 가이드
- 뚜벅이 여행자를 위한 꿀팁
- 계절별 추천 정보 및 행사
- 현지인 추천 숨은 맛집

### 6. 관리자 기능
- **장소 관리**: 추가, 수정, 삭제 기능
- **이미지 업로드**: 드래그 앤 드롭 지원, 자동 압축
- **실시간 미리보기**: 변경사항 즉시 확인
- **벡터 임베딩 생성**: 새 장소 추가 시 자동 벡터화

## 🛠️ 기술 스택

### Frontend Framework
- **Next.js 15.3.4** - React 기반 풀스택 프레임워크
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성

### Backend & Database
- **Firebase v9** 
  - Authentication (사용자 인증)
  - Firestore (NoSQL 데이터베이스)
  - Storage (이미지 저장)
- **Vercel Serverless Functions** - API 엔드포인트

### AI & Search
- **OpenAI API** - GPT 모델 활용
- **Pinecone** - 벡터 데이터베이스
- **텍스트 임베딩** - 시맨틱 검색 구현

### Styling & UI
- **CSS Modules** - 컴포넌트 스코프 스타일링
- **Glass Morphism** - 모던한 UI 디자인
- **FontAwesome** - 아이콘
- **Swiper.js** - 터치 친화적 이미지 슬라이더

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Yarn** - 패키지 매니저

## 📱 반응형 디자인

모든 디바이스에서 최적화된 경험을 제공합니다:
- 모바일 (~ 768px): 터치 최적화 UI
- 태블릿 (768px ~ 1024px): 적응형 레이아웃
- 데스크톱 (1024px ~): 풀 기능 인터페이스

## 🚀 시작하기

### 필수 요구사항
- Node.js 16.0.0 이상
- Yarn 패키지 매니저
- Firebase 프로젝트
- Pinecone 계정 (선택사항)

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Firebase (필수)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# AI & Vector Search (선택사항 - 서버사이드)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
OPENAI_API_KEY=your_openai_api_key  # 폴백용
```

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/jeju-guide.git
cd jeju-guide

# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# API 서버와 함께 실행 (AI 기능 로컬 테스트)
yarn dev:all
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드 및 배포

```bash
# 프로덕션 빌드
yarn build

# 프로덕션 실행 (로컬 테스트)
yarn start
```

## 🤖 AI 어시스턴트 사용법

1. 홈페이지 우측 하단의 🤖 버튼 클릭
2. 첫 사용 시 ⚙️ 버튼을 클릭하여 OpenAI API 키 입력
3. 제주도 여행에 대해 자유롭게 질문
4. 스타터 프롬프트로 빠른 시작 가능

### AI 기능 예시
- "제주도 흑돼지 맛집 추천해줘"
- "비오는 날 가기 좋은 실내 관광지는?"
- "성산일출봉 근처 카페 알려줘"
- "2박 3일 일정 짜줘"

## 📁 프로젝트 구조

```
jeju-guide/
├── public/               # 정적 파일
├── src/
│   ├── pages/           # Next.js 페이지 라우트
│   │   ├── api/         # API 엔드포인트
│   │   │   ├── ai-chat.js
│   │   │   ├── vector-search.js
│   │   │   └── generate-embeddings.js
│   │   ├── index.tsx    # 홈페이지
│   │   ├── admin.tsx    # 관리자 페이지
│   │   └── ...
│   ├── components/      # React 컴포넌트
│   │   ├── AIChat.tsx   # AI 채팅 인터페이스
│   │   ├── Map.tsx      # 지도 컴포넌트
│   │   └── ...
│   ├── css/            # 스타일 파일
│   ├── utils/          # 유틸리티 함수
│   │   └── vectorSearch.ts
│   ├── types/          # TypeScript 타입
│   └── fBase.ts        # Firebase 설정
├── .env.local          # 환경 변수 (git 제외)
├── next.config.js      # Next.js 설정
├── vercel.json         # Vercel 배포 설정
└── package.json
```

## 🚢 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 설정:
   - `PINECONE_API_KEY`
   - `PINECONE_INDEX_NAME`
   - 모든 `NEXT_PUBLIC_FIREBASE_*` 변수들
3. 자동 배포 활성화

### 배포 체크리스트
- [ ] 환경 변수 설정 확인
- [ ] TypeScript 빌드 에러 해결
- [ ] Firebase Security Rules 설정
- [ ] Pinecone 인덱스 생성 및 설정

## 👥 만든 사람들

- **김관경** - 풀스택 개발, AI 시스템 구현
- **박태훈** - 제주 콘텐츠 큐레이션, UX 디자인

## 🙏 감사의 말

- 제주도의 아름다운 자연과 문화
- 모든 오픈소스 컨트리뷰터들
- 피드백을 주신 사용자분들

---

제주도의 숨은 매력을 AI와 함께 발견하는 여정에 함께해주셔서 감사합니다! 🌊🤖
