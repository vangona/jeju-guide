import OpenAI from 'openai';
import admin from 'firebase-admin';
import { Pinecone } from '@pinecone-database/pinecone';

// Firebase Admin 초기화
if (!admin.apps.length) {
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

// Admin 사용자 UID 목록 (환경변수로 관리)
const ADMIN_UIDS = process.env.ADMIN_UIDS ? process.env.ADMIN_UIDS.split(',') : [];

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

  try {
    const { userId } = req.body;

    // 관리자 권한 확인
    if (!ADMIN_UIDS.includes(userId)) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    // OpenAI 클라이언트 초기화 (임베딩 생성용)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 모든 장소 데이터 가져오기
    const placesSnapshot = await db.collection('places').get();
    const places = [];

    placesSnapshot.forEach((doc) => {
      const data = doc.data();
      places.push({
        id: doc.id,
        ...data,
      });
    });

    let processedCount = 0;

    // 각 장소에 대해 임베딩 생성
    for (const place of places) {
      try {
        // 이미 임베딩이 있는 경우 스킵
        if (place.embedding && place.embedding.length > 0) {
          continue;
        }

        // 검색용 텍스트 생성 (장소명, 설명, 주소, 타입 결합)
        const searchText = [
          place.name || '',
          place.description || '',
          place.addressDetail || place.address || '',
          place.type || '',
        ].filter(Boolean).join(' ');

        if (!searchText.trim()) {
          continue;
        }

        // OpenAI 임베딩 생성
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: searchText,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Firestore에 임베딩 저장
        await db.collection('places').doc(place.id).update({
          embedding: embedding,
          embeddingText: searchText,
          embeddingUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        processedCount++;
        
        // API 레이트 리미트 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing place ${place.id}:`, error);
        // 개별 장소 처리 실패는 전체 프로세스를 중단하지 않음
        continue;
      }
    }

    res.status(200).json({
      success: true,
      processedCount,
      totalPlaces: places.length,
      message: `Successfully generated embeddings for ${processedCount} places`
    });

  } catch (error) {
    console.error('Error generating embeddings:', error);
    res.status(500).json({
      error: 'Failed to generate embeddings',
      details: error.message
    });
  }
}