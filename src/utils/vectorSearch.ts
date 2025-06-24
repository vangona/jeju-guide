import { dbService } from '../fBase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { PlaceInfo } from '../types';

// OpenAI Embeddings 생성 함수
const createEmbedding = async (text: string, apiKey: string): Promise<number[]> => {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create embedding');
  }

  const data = await response.json();
  return data.data[0].embedding;
};

// 기본 텍스트 검색 (폴백용)
const searchPlacesWithText = async (searchQuery: string, maxResults: number = 3) => {
  try {
    const placesRef = collection(dbService, 'places');
    const searchLower = searchQuery.toLowerCase();
    
    // 전체 장소 가져오기
    const snapshot = await getDocs(placesRef);
    const places: PlaceInfo[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as PlaceInfo;
      data.id = doc.id; // 문서 ID 추가
      const name = data.name?.toLowerCase() || '';
      const description = data.description?.toLowerCase() || '';
      const address = data.address?.toLowerCase() || '';
      
      // 간단한 텍스트 매칭
      if (name.includes(searchLower) || 
          description.includes(searchLower) || 
          address.includes(searchLower)) {
        places.push(data);
      }
    });
    
    // 관련성 점수 계산 및 정렬
    const scoredPlaces = places.map(place => {
      let score = 0;
      const nameLower = place.name?.toLowerCase() || '';
      const descLower = place.description?.toLowerCase() || '';
      
      // 이름에 포함되면 높은 점수
      if (nameLower.includes(searchLower)) score += 10;
      // 설명에 포함되면 중간 점수
      if (descLower.includes(searchLower)) score += 5;
      // 완전 일치하면 추가 점수
      if (nameLower === searchLower) score += 20;
      
      return { place, score };
    });

    console.log(scoredPlaces)
    
    // 점수순으로 정렬하고 상위 결과만 반환
    return scoredPlaces
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.place);
  } catch (error) {
    return [];
  }
};

// Pinecone Vector Search 함수
export const searchPlacesWithVector = async (
  searchQuery: string, 
  apiKey: string,
  maxResults: number = 3
): Promise<PlaceInfo[]> => {
  try {
    // Vercel Functions를 통해 Pinecone 검색 수행
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api/vector-search'
      : '/api/vector-search';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: searchQuery, 
        apiKey,
        limit: maxResults
      })
    });

    if (!response.ok) {
      throw new Error('Vector search API failed');
    }

    const data = await response.json();
    
    if (data.success && data.places) {
      return data.places;
    } else {
      throw new Error('Vector search returned no results');
    }
  } catch (error) {
    console.warn('Vector search failed, falling back to text search:', error);
    // 벡터 검색 실패 시 기본 텍스트 검색으로 폴백
    return searchPlacesWithText(searchQuery, maxResults);
  }
};

// 컨텍스트 생성 함수
export const createContextFromPlaces = (places: PlaceInfo[]): string => {
  if (places.length === 0) {
    return '검색 결과가 없습니다.';
  }
  
  const context = places.map((place, index) => {
    return `${index + 1}. ${place.name}
주소: ${place.address}${place.extraAddress ? ` ${place.extraAddress}` : ''}
설명: ${place.description}
종류: ${place.type}
`;
  }).join('\n---\n');
  
  return context;
};