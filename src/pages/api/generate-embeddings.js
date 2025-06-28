import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { places, apiKey } = req.body;

    if (!places || !Array.isArray(places)) {
      return res.status(400).json({ error: 'Places data is required' });
    }

    if (!apiKey) {
      return res.status(400).json({ error: 'OpenAI API key is required' });
    }

    // OpenAI 클라이언트 초기화
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Pinecone 클라이언트 초기화
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'jeju-guide';

    // Pinecone 인덱스 가져오기
    const index = pinecone.index(indexName);

    let processedCount = 0;
    const vectors = [];

    // 각 장소에 대해 임베딩 생성
    for (const place of places) {
      try {
        // 검색용 텍스트 생성 (장소명, 설명, 주소, 타입 결합)
        const searchText = [
          place.name || '',
          place.description || '',
          place.addressDetail || place.address || '',
          place.type || '',
        ]
          .filter(Boolean)
          .join(' ');

        if (!searchText.trim()) {
          continue;
        }

        // OpenAI 임베딩 생성
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: searchText,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Pinecone에 저장할 벡터 데이터 준비
        vectors.push({
          id: place.id,
          values: embedding,
          metadata: {
            name: place.name,
            type: place.type,
            description: place.description.substring(0, 500), // 메타데이터 크기 제한
            address: place.addressDetail || place.address || '',
            searchText: searchText.substring(0, 1000), // 검색 텍스트 저장
            lat:
              place.geocode && place.geocode['1'] ? place.geocode['1'] : null,
            lng:
              place.geocode && place.geocode['0'] ? place.geocode['0'] : null,
          },
        });

        processedCount++;

        // 50개씩 배치로 처리 (더 작은 배치로 안정성 증대)
        if (vectors.length >= 50) {
          await index.upsert(vectors);
          vectors.length = 0; // 배열 초기화
        }

        // API 레이트 리미트 방지를 위한 딜레이
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error processing place ${place.id}:`, error);
        // 개별 장소 처리 실패는 전체 프로세스를 중단하지 않음
        continue;
      }
    }

    // 남은 벡터들 처리
    if (vectors.length > 0) {
      await index.upsert(vectors);
    }

    res.status(200).json({
      success: true,
      processedCount,
      totalPlaces: places.length,
      message: `Successfully generated embeddings for ${processedCount} places`,
    });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    res.status(500).json({
      error: 'Failed to generate embeddings',
      details: error.message,
    });
  }
}
