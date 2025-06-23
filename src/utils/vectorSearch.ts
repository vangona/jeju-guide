import { getFunctions, httpsCallable } from 'firebase/functions';
import { dbService } from '../fBase';
import { collection, getDocs } from 'firebase/firestore';
import type { PlaceInfo } from '../types';

// 기본 텍스트 검색 (폴백용)
const searchPlacesWithText = async (searchQuery: string, maxResults: number = 5) => {
  try {
    const placesRef = collection(dbService, 'places');
    const searchLower = searchQuery.toLowerCase();
    
    // 전체 장소 가져오기
    const snapshot = await getDocs(placesRef);
    const places: PlaceInfo[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as PlaceInfo;
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
    
    // 점수순으로 정렬하고 상위 결과만 반환
    return scoredPlaces
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.place);
  } catch (error) {
    return [];
  }
};

// 벡터 검색 함수 (Firebase Extension 사용)
export const searchPlacesWithVector = async (searchQuery: string, maxResults: number = 5) => {
  try {
    const functions = getFunctions();
    const vectorSearch = httpsCallable(functions, 'ext-firestore-vector-search-queryCallable');
    
    const result = await vectorSearch({
      query: searchQuery,
      limit: maxResults
    });

    return result.data as PlaceInfo[];
  } catch (error) {
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