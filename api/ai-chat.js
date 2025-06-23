import OpenAI from 'openai';

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

  const { query, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ 
      message: 'OpenAI API 키가 필요합니다.' 
    });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `당신은 제주도 여행 전문가입니다. 사용자의 질문에 대해 제주도 여행지, 맛집, 체험 등을 추천해주세요. 
          답변은 친근하고 도움이 되는 톤으로 작성하며, 구체적인 장소명과 간단한 설명을 포함해주세요.`
        },
        {
          role: 'user',
          content: query
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