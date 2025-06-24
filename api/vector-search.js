import OpenAI from 'openai';
import admin from 'firebase-admin';

// Firebase Admin 초기화
if (!admin.apps.length) {
  // Vercel 환경 변수에서 서비스 계정 정보 가져오기
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
      error: 'OpenAI API 키가 필요합니다.' 
    });
  }

  const openai = new OpenAI({ apiKey });

  try {
    // 1. 검색 쿼리의 임베딩 생성
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: searchQuery
    });
    
    const queryVector = embeddingResponse.data[0].embedding;

    // 2. Firestore에서 모든 장소 가져오기 (임베딩이 있는 것만)
    const placesSnapshot = await db.collection('places')
      .where('embedding', '!=', null)
      .get();

    // 3. 코사인 유사도 계산
    const calculateCosineSimilarity = (vec1, vec2) => {
      let dotProduct = 0;
      let norm1 = 0;
      let norm2 = 0;
      
      for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        norm1 += vec1[i] * vec1[i];
        norm2 += vec2[i] * vec2[i];
      }
      
      return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    };

    // 4. 각 장소의 유사도 계산
    const placesWithSimilarity = [];
    placesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.embedding && Array.isArray(data.embedding)) {
        const similarity = calculateCosineSimilarity(queryVector, data.embedding);
        placesWithSimilarity.push({
          id: doc.id,
          ...data,
          similarity
        });
      }
    });

    // 5. 유사도순으로 정렬하고 상위 N개 반환
    const topPlaces = placesWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(({ similarity, embedding, ...place }) => place); // embedding 제거

    return res.status(200).json({
      success: true,
      places: topPlaces
    });

  } catch (error) {
    console.error('Vector search error:', error);
    return res.status(500).json({
      success: false,
      error: '벡터 검색 중 오류가 발생했습니다.'
    });
  }
}