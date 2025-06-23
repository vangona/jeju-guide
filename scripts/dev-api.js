const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { SYSTEM_PROMPT } = require('../prompts/system');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API 엔드포인트
app.post('/api/ai-chat', async (req, res) => {
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
          content: SYSTEM_PROMPT
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
});

app.listen(PORT, () => {
  console.log(`개발 API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('React 앱에서 http://localhost:3001/api/ai-chat 로 요청을 보낼 수 있습니다.');
});