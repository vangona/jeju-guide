import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { searchPlacesWithVector, createContextFromPlaces } from '../utils/vectorSearch';
import PlaceCard from './PlaceCard';
import type { PlaceInfo } from '../types';
import '../css/AIChat.css';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: string;
  content: string;
  places?: PlaceInfo[];
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '안녕하세요! 제주도 여행에 대해 궁금한 것이 있으시면 물어보세요!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // 마크다운인지 확인하는 함수
  const isMarkdown = (text: string) => {
    const markdownPatterns = [
      /^#{1,6}\s/m,      // 헤더
      /\*\*.*\*\*/,      // 볼드
      /\*.*\*/,          // 이탤릭
      /\[.*\]\(.*\)/,    // 링크
      /^-\s/m,           // 리스트
      /^\d+\.\s/m,       // 번호 리스트
      /```/,             // 코드 블록
      /`.*`/             // 인라인 코드
    ];
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  // marked 설정
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // 메시지 렌더링 함수
  const renderMessage = (content: string, role: string) => {
    if (role === 'assistant' && isMarkdown(content)) {
      // marked.parse는 동기 함수로 string을 반환
      const htmlContent = marked.parse(content) as string;
      return (
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            lineHeight: '1.6',
            wordBreak: 'break-word'
          }}
        />
      );
    }
    
    // 일반 텍스트는 줄바꿈을 유지하며 표시
    return (
      <pre style={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: 'inherit',
        margin: 0,
        lineHeight: '1.6'
      }}>
        {content}
      </pre>
    );
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      setShowApiKeyInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !apiKey) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input; // 입력값 저장
    setInput('');
    setLoading(true);

    try {
      // 1. 먼저 관련 장소 검색
      const relatedPlaces = await searchPlacesWithVector(currentInput, 5);
      const placesContext = createContextFromPlaces(relatedPlaces);
      
      // 2. AI에게 컨텍스트와 함께 질문
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001/api/ai-chat' 
        : '/api/ai-chat';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: currentInput, 
          apiKey,
          relatedPlaces: placesContext
        })
      });

      const data = await response.json();
      const aiMessage: Message = { 
        role: 'assistant', 
        content: data.message,
        places: relatedPlaces.length > 0 ? relatedPlaces : undefined
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-modal" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.6)', 
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="ai-chat-container" style={{ 
        background: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '450px',
        maxHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏝️</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>제주 AI 가이드</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setShowApiKeyInput(!showApiKeyInput)} 
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
            >
              ⚙️
            </button>
            <button 
              onClick={onClose}
              style={{ 
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.3)'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)'}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* API Key Input */}
        {showApiKeyInput && (
          <div style={{ 
            margin: '20px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '16px' }}>🔑</span>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#495057' }}>
                OpenAI API 키를 입력하세요
              </p>
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={{ 
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
              onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e9ecef'}
            />
            <button 
              onClick={handleApiKeySubmit} 
              style={{ 
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#218838'}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#28a745'}
            >
              💾 저장
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="ai-chat-messages" style={{ 
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          maxHeight: '400px'
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                backgroundColor: msg.role === 'user' ? '#667eea' : '#f8f9fa',
                color: msg.role === 'user' ? 'white' : '#333',
                fontSize: '14px',
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px' }}>🤖</span>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#6c757d' }}>AI 가이드</span>
                  </div>
                )}
                {renderMessage(msg.content, msg.role)}
                
                {/* 장소 카드 표시 */}
                {msg.places && msg.places.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: '500', 
                      color: '#6c757d',
                      marginBottom: '8px'
                    }}>
                      📍 추천 장소 ({msg.places.length}곳)
                    </div>
                    {msg.places.map((place, idx) => (
                      <PlaceCard 
                        key={place.id || idx} 
                        place={place}
                        onPlaceClick={(p) => {
                          if (p.url) {
                            window.open(p.url, '_blank');
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '20px 20px 20px 4px',
                backgroundColor: '#f8f9fa',
                color: '#6c757d',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🤖</span>
                  <span>생각 중...</span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <div style={{ width: '4px', height: '4px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '4px', height: '4px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.5s' }}></div>
                    <div style={{ width: '4px', height: '4px', backgroundColor: '#6c757d', borderRadius: '50%', animation: 'pulse 1.5s infinite 1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div style={{ 
          padding: '20px',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#fff'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="제주도에 대해 물어보세요... (예: 맛집 추천해주세요)"
                style={{ 
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
                disabled={loading}
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#667eea'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = '#e9ecef'}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !input.trim() || !apiKey}
              style={{ 
                padding: '14px 20px',
                backgroundColor: loading || !apiKey ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading || !apiKey ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                minWidth: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              onMouseOver={(e) => {
                if (!loading && apiKey && input.trim()) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#5a67d8';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && apiKey) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#667eea';
                }
              }}
            >
              {!apiKey ? '🔑' : loading ? '⏳' : '🚀'}
              <span>{!apiKey ? 'API키' : loading ? '전송중' : '전송'}</span>
            </button>
          </form>
          
          {!apiKey && (
            <div style={{ 
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#856404',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>⚠️</span>
              <span>채팅을 시작하려면 위의 ⚙️ 버튼을 클릭하여 OpenAI API 키를 입력하세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIChat;