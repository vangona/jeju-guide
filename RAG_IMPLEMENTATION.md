# 제주 가이드 RAG 구현

## 개요
Firebase Vector Search Extension과 기존 Firestore 데이터를 활용한 RAG(Retrieval-Augmented Generation) 시스템 구현

## 구현 방식

### 1. Vector Search Extension 없이 구현 (현재)
- 클라이언트에서 직접 Firestore 검색
- 간단한 텍스트 매칭 기반 검색
- OpenAI API로 컨텍스트와 함께 질문 전송

### 2. Vector Search Extension 사용 시 (권장)
1. Firebase Console에서 Extension 설치
2. 기존 `places` 컬렉션에 자동으로 임베딩 생성
3. `ext-firestore-vector-search-queryCallable` 함수 호출로 시맨틱 검색

## 현재 구현 특징

### 검색 프로세스
1. 사용자가 질문 입력 (예: "해산물 맛집 추천해줘")
2. `searchPlacesWithVector` 함수가 관련 장소 검색
   - Vector Search 실패 시 텍스트 검색으로 폴백
3. 검색된 장소 정보를 컨텍스트로 변환
4. OpenAI API에 컨텍스트와 함께 질문 전송
5. AI가 실제 데이터 기반으로 답변 생성

### 주요 파일
- `/src/utils/vectorSearch.ts`: 벡터 검색 및 텍스트 검색 로직
- `/src/components/AIChat.tsx`: RAG 통합된 채팅 UI
- `/api/ai-chat.js`: 컨텍스트 포함 AI 응답 생성

### 장점
- 실제 데이터베이스의 최신 정보 활용
- 할루시네이션 감소
- 구체적인 장소명과 정보 제공
- Extension 없이도 기본 검색 가능

## 향후 개선사항
1. Firebase Vector Search Extension 설치로 검색 정확도 향상
2. 임베딩 모델 최적화
3. 검색 결과 순위 알고리즘 개선
4. 사용자 피드백 기반 검색 개선