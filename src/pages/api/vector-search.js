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

  const { query: searchQuery, apiKey, limit = 5 } = req.body;

  if (!apiKey) {
    return res.status(400).json({
      error: 'OpenAI API 키가 필요합니다.',
    });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // 1. 검색 쿼리의 임베딩 생성
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: searchQuery,
    });

    const queryVector = embeddingResponse.data[0].embedding;

    // 2. Pinecone 클라이언트 초기화
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const indexName = process.env.PINECONE_INDEX_NAME || 'jeju-guide';
    const index = pinecone.index(indexName);

    // 3. Pinecone에서 유사한 벡터 검색
    const searchResponse = await index.query({
      vector: queryVector,
      topK: limit,
      includeValues: false,
      includeMetadata: true,
    });

    // 4. Pinecone 메타데이터에서 장소 정보 추출
    const places = searchResponse.matches.map((match) => ({
      id: match.id,
      name: match.metadata.name,
      type: match.metadata.type,
      description: match.metadata.description,
      address: match.metadata.address,
      addressDetail: match.metadata.address, // 호환성을 위해
      geocode: {
        0: match.metadata.lng, // 경도
        1: match.metadata.lat, // 위도
      },
      score: match.score,
    }));

    return res.status(200).json({
      success: true,
      places: places,
    });
  } catch (error) {
    console.error('Vector search error:', error);
    return res.status(500).json({
      success: false,
      error: '벡터 검색 중 오류가 발생했습니다.',
    });
  }
}
