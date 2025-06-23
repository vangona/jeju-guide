import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '../prompts/system';

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

  const { query, apiKey, relatedPlaces } = req.body;

  if (!apiKey) {
    return res.status(400).json({ 
      message: 'OpenAI API 키가 필요합니다.' 
    });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    // 관련 장소 정보를 컨텍스트에 포함
    let enhancedQuery = query;
    if (relatedPlaces && relatedPlaces.length > 0) {
      enhancedQuery = `사용자 질문: ${query}\n\n참고할 수 있는 제주도 장소 정보:\n${relatedPlaces}\n\n위 장소 정보를 참고하여 답변해주세요.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: enhancedQuery
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || '죄송합니다. 답변을 생성할 수 없습니다.';

    return res.status(200).json({
      message: aiResponse,
      recommendedPlaces: []
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({
      message: '죄송합니다. 현재 AI 서비스에 문제가 있습니다. 잠시 후 다시 시도해주세요.'
    });
  }
}