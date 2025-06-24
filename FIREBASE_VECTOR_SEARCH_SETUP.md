# Firebase Vector Search 설정 가이드

## 1. Firebase Extensions 설치

1. Firebase Console에서 프로젝트 열기
2. Extensions 탭으로 이동
3. "Vector Search with Firestore" 확장 프로그램 검색
4. "Install" 클릭

## 2. 확장 프로그램 구성

### 필수 설정:
- **Collection path**: `places` (기존 장소 데이터 컬렉션)
- **Input field**: `description` (임베딩을 생성할 필드)
- **Embedding field**: `embedding` (벡터가 저장될 필드)
- **Embedding provider**: OpenAI
- **OpenAI API Key**: 환경 변수로 설정

### 선택적 설정:
- **Model**: `text-embedding-3-small`
- **Batch size**: 100
- **Index management collection**: `vector_indexes`

## 3. 벡터 인덱스 생성

Firebase Console 또는 CLI에서:

```bash
gcloud firestore indexes composite create \
--collection-group=places \
--query-scope=COLLECTION \
--field-config field-path=embedding,vector-config='{"dimension":"1536", "flat": "{}"}'
```

## 4. 기존 데이터 임베딩 생성

설치 후 기존 문서들에 대한 임베딩을 생성하려면:
1. 각 문서를 업데이트하여 트리거 실행
2. 또는 별도의 마이그레이션 스크립트 실행

## 5. 클라이언트 사용법

```javascript
// 벡터 검색 함수 호출
const searchResults = await firebase.functions().httpsCallable('vectorSearch')({
  query: "해산물 맛집",
  limit: 5,
  prefilter: {
    location: "제주시"
  }
});
```