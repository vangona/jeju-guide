import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import {
  searchPlacesWithVector,
  createContextFromPlaces,
} from '../utils/vectorSearch';
import PlaceCard from './PlaceCard';
import type { PlaceInfo } from '../types';
import styles from '../css/AIChat.module.css';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceSelect?: (place: PlaceInfo) => void;
  isMobile?: boolean;
}

interface Message {
  role: string;
  content: string;
  places?: PlaceInfo[];
}

interface ConversationSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  onClose,
  onPlaceSelect,
  isMobile,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [showSessionManager, setShowSessionManager] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // 스마트 스타터 프롬프트 - 사용자의 실제 니즈 기반
  const starterPrompts = [
    {
      id: 'first-time',
      icon: '🗺️',
      title: '제주 처음이에요',
      description: '첫 제주 여행 필수 코스',
      prompt: '제주도를 처음 방문하는데, 꼭 가봐야 할 핵심 장소들과 2박 3일 추천 일정을 알려주세요. 대중교통으로 이동 가능한 곳 위주로 부탁해요.'
    },
    {
      id: 'local-hidden',
      icon: '💎',
      title: '현지인만 아는 곳',
      description: '관광객 없는 진짜 제주',
      prompt: '관광객들이 잘 모르는 제주도 현지인들만 아는 맛집이나 명소를 알려주세요. SNS에 많이 나오지 않는 진짜 숨은 보석 같은 곳들이 궁금해요.'
    },
    {
      id: 'food-focused',
      icon: '🍽️',
      title: '제주 먹방 여행',
      description: '제주 대표 음식 총정리',
      prompt: '제주도 대표 음식들(흑돼지, 갈치조림, 옥돔 등)을 제대로 맛볼 수 있는 맛집들을 추천해주세요. 각 음식별로 가장 맛있는 곳과 가격대도 알려주세요.'
    },
    {
      id: 'nature-healing',
      icon: '🌿',
      title: '자연 힐링 여행',
      description: '제주의 아름다운 자연',
      prompt: '제주도의 아름다운 자연을 만끽할 수 있는 곳들을 추천해주세요. 올레길, 해안 산책로, 숲길 등 힐링이 되는 장소와 최적의 방문 시간을 알려주세요.'
    },
    {
      id: 'rainy-day',
      icon: '🌧️',
      title: '비 오는 날에도',
      description: '실내에서 즐길 수 있는 곳',
      prompt: '제주도에서 날씨가 안 좋을 때나 비가 올 때 갈 수 있는 실내 관광지나 체험공간들을 추천해주세요. 아이들과 함께 가기 좋은 곳도 포함해서요.'
    },
    {
      id: 'romantic-date',
      icon: '💕',
      title: '로맨틱 데이트',
      description: '커플 여행 코스',
      prompt: '제주도에서 커플이 가기 좋은 로맨틱한 장소들을 추천해주세요. 석양 명소, 분위기 좋은 카페나 레스토랑, 데이트 코스도 함께 알려주세요.'
    }
  ];

  // 키보드 단축키 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      // ESC: 모달 닫기
      if (event.key === 'Escape') {
        if (showSessionManager) {
          setShowSessionManager(false);
        } else if (showApiKeyInput) {
          setShowApiKeyInput(false);
        } else {
          onClose();
        }
        return;
      }

      // Ctrl/Cmd + N: 새 대화
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        handleNewConversation();
        return;
      }

      // Ctrl/Cmd + L: 대화 목록
      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        setShowSessionManager(!showSessionManager);
        return;
      }

      // Ctrl/Cmd + K: API 키 설정
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowApiKeyInput(!showApiKeyInput);
        return;
      }

      // 숫자 키 1-6: 스타터 프롬프트 선택
      if (showStarterPrompts && event.key >= '1' && event.key <= '6') {
        const index = parseInt(event.key) - 1;
        if (index < starterPrompts.length) {
          event.preventDefault();
          handleStarterPrompt(starterPrompts[index].prompt);
        }
        return;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달이 열렸을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, showSessionManager, showApiKeyInput, showStarterPrompts, starterPrompts]);

  // 백드롭 클릭 핸들러
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // 사용자 질문이 장소 추천을 요청하는지 판단
  const checkIfPlaceRecommendationRequest = (input: string): boolean => {
    const recommendationKeywords = [
      '추천',
      '어디',
      '가볼만한',
      '맛집',
      '카페',
      '관광지',
      '숙소',
      '여행지',
      '가고싶',
      '보고싶',
      '먹고싶',
      '방문',
      '구경',
      '놀러',
      '데이트',
      '맛있는',
      '예쁜',
      '유명한',
      '인기',
      '핫플',
      '명소',
      '알려줘',
      '알려주세요',
      '소개',
      '찾아줘',
      '찾아주세요',
      '있나요',
      '있을까요',
      '뭐가 있어',
      '어떤 곳',
      '장소',
      '곳',
      '위치',
      '스팟',
      '어떻게',
      '방법',
    ];

    const lowerInput = input.toLowerCase();
    return recommendationKeywords.some(
      (keyword) =>
        lowerInput.includes(keyword) ||
        lowerInput.includes(keyword.toLowerCase()),
    );
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // 메시지가 변경될 때마다 세션 저장
  useEffect(() => {
    if (messages.length > 0 && currentSessionId) {
      saveCurrentSession(messages);
    }
  }, [messages, currentSessionId]);

  // 컴포넌트 초기화 시 세션 로드 및 API 키 확인
  useEffect(() => {
    // 세션 로드
    const savedSessions = loadSessions();
    setSessions(savedSessions);

    // 가장 최근 세션 로드 또는 새 세션 시작
    if (savedSessions.length > 0) {
      const latestSession = savedSessions[0];
      setCurrentSessionId(latestSession.id);
      setMessages(latestSession.messages);
      setShowStarterPrompts(latestSession.messages.length === 1);
    } else {
      // 새 세션 시작
      const newSessionId = generateSessionId();
      const newMessages = [
        {
          role: 'assistant',
          content:
            '안녕하세요! 제주도 여행 가이드입니다. 🏝️\n\n어떤 여행을 계획하고 계신가요? 아래에서 관심 있는 주제를 선택하시거나 직접 질문해주세요!',
        },
      ];
      setCurrentSessionId(newSessionId);
      setMessages(newMessages);
      setShowStarterPrompts(true);
    }

    // API 키 확인
    const adminKey = localStorage.getItem('admin_openai_api_key');
    const userKey = localStorage.getItem('openai_api_key');

    if (adminKey) {
      setApiKey(adminKey);
    } else if (userKey) {
      setApiKey(userKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // 마크다운인지 확인하는 함수
  const isMarkdown = (text: string) => {
    const markdownPatterns = [
      /^#{1,6}\s/m, // 헤더
      /\*\*.*\*\*/, // 볼드
      /\*.*\*/, // 이탤릭
      /\[.*\]\(.*\)/, // 링크
      /^-\s/m, // 리스트
      /^\d+\.\s/m, // 번호 리스트
      /```/, // 코드 블록
      /`.*`/, // 인라인 코드
    ];
    return markdownPatterns.some((pattern) => pattern.test(text));
  };

  // marked 설정
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // 메시지 렌더링 함수
  const renderMessage = (content: string, role: string) => {
    if (role === 'assistant' && isMarkdown(content)) {
      // marked.parse는 동기 함수로 string을 반환
      const htmlContent = marked.parse(content) as string;
      return (
        <div
          className={styles.markdownContent}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            lineHeight: '1.6',
            wordBreak: 'break-word',
          }}
        />
      );
    }

    // 일반 텍스트는 줄바꿈을 유지하며 표시
    return (
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontFamily: 'inherit',
          margin: 0,
          lineHeight: '1.6',
        }}
      >
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

  // 스타터 프롬프트 핸들러
  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt);
    setShowStarterPrompts(false);
  };

  // 세션 ID 생성
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // 세션 제목 생성 (첫 번째 사용자 메시지 기반)
  const generateSessionTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 30 
        ? firstUserMessage.content.substring(0, 30) + '...'
        : firstUserMessage.content;
    }
    return '새 대화';
  };

  // 세션 저장
  const saveSessions = (sessionsToSave: ConversationSession[]) => {
    try {
      localStorage.setItem('ai_chat_sessions', JSON.stringify(sessionsToSave));
    } catch (error) {
      console.error('세션 저장 실패:', error);
    }
  };

  // 세션 로드
  const loadSessions = (): ConversationSession[] => {
    try {
      const saved = localStorage.getItem('ai_chat_sessions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('세션 로드 실패:', error);
    }
    return [];
  };

  // 현재 세션 저장
  const saveCurrentSession = (messages: Message[]) => {
    if (messages.length <= 1) return; // 초기 메시지만 있으면 저장하지 않음

    const updatedSessions = [...sessions];
    const sessionIndex = updatedSessions.findIndex(s => s.id === currentSessionId);
    const title = generateSessionTitle(messages);

    if (sessionIndex >= 0) {
      // 기존 세션 업데이트
      updatedSessions[sessionIndex] = {
        ...updatedSessions[sessionIndex],
        messages,
        title,
        lastUpdated: Date.now(),
      };
    } else {
      // 새 세션 생성
      const newSession: ConversationSession = {
        id: currentSessionId,
        title,
        messages,
        lastUpdated: Date.now(),
      };
      updatedSessions.unshift(newSession); // 최신 세션을 맨 앞에
    }

    // 최대 10개 세션만 유지
    if (updatedSessions.length > 10) {
      updatedSessions.splice(10);
    }

    setSessions(updatedSessions);
    saveSessions(updatedSessions);
  };

  // 새 대화 시작 핸들러
  const handleNewConversation = () => {
    const newSessionId = generateSessionId();
    const newMessages = [
      {
        role: 'assistant',
        content:
          '안녕하세요! 제주도 여행 가이드입니다. 🏝️\n\n어떤 여행을 계획하고 계신가요? 아래에서 관심 있는 주제를 선택하시거나 직접 질문해주세요!',
      },
    ];
    
    setCurrentSessionId(newSessionId);
    setMessages(newMessages);
    setInput('');
    setShowStarterPrompts(true);
    setLoading(false);
    setShowSessionManager(false);
  };

  // 세션 로드 핸들러
  const handleLoadSession = (session: ConversationSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowStarterPrompts(session.messages.length === 1);
    setShowSessionManager(false);
  };

  // 세션 삭제 핸들러
  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    
    // 현재 세션이 삭제되면 새 대화 시작
    if (sessionId === currentSessionId) {
      handleNewConversation();
    }
  };

  // 메시지 복사 핸들러
  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      // 폴백: 구식 방법으로 복사 시도
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (fallbackErr) {
        console.error('복사 실패:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !apiKey) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // 입력값 저장
    setInput('');
    setLoading(true);
    setShowStarterPrompts(false); // 메시지 전송 시 스타터 프롬프트 숨김

    try {
      // 1. 사용자 질문이 장소 추천을 요청하는지 판단
      const isPlaceRecommendationRequest =
        checkIfPlaceRecommendationRequest(currentInput);

      let relatedPlaces: PlaceInfo[] = [];
      let placesContext = '';

      // 2. 장소 추천 요청일 때만 벡터 검색 수행
      if (isPlaceRecommendationRequest) {
        relatedPlaces = await searchPlacesWithVector(currentInput, apiKey, 3);
        placesContext = createContextFromPlaces(relatedPlaces);
      }

      // 3. AI에게 컨텍스트와 함께 질문
      const apiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api/ai-chat'
          : '/api/ai-chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentInput,
          apiKey,
          relatedPlaces: placesContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message || '죄송합니다. 답변을 생성할 수 없습니다.',
        places:
          isPlaceRecommendationRequest && relatedPlaces.length > 0
            ? relatedPlaces
            : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      let errorMessage = '죄송합니다. 오류가 발생했습니다.';

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage =
            'API 서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
        } else if (error.message.includes('401')) {
          errorMessage =
            'OpenAI API 키가 유효하지 않습니다. 설정을 확인해주세요.';
        } else if (error.message.includes('429')) {
          errorMessage =
            'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      const errorMsg = { role: 'assistant', content: errorMessage };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.aiChatModal}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // 모바일에서 네비게이션 공간 확보
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className={styles.aiChatContainer}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: isMobile ? '100%' : '450px',
          height: isMobile ? 'calc(100vh - 150px)' : 'auto', // 네비게이션 높이 고려
          maxHeight: isMobile ? 'calc(100vh - 150px)' : '600px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏝️</span>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              제주 AI 가이드
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowSessionManager(!showSessionManager)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.3)')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.2)')
              }
              title="대화 목록 (Ctrl/Cmd + L)"
            >
              📚
            </button>
            <button
              onClick={handleNewConversation}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                padding: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.3)')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.2)')
              }
              title="새 대화 시작 (Ctrl/Cmd + N)"
            >
              ➕
            </button>
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
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.3)')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.2)')
              }
              title="API 키 설정 (Ctrl/Cmd + K)"
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
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.3)')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.background =
                  'rgba(255,255,255,0.2)')
              }
              title="채팅 닫기 (ESC)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Session Manager - Compact Dropdown Style */}
        {showSessionManager && (
          <>
            {/* Backdrop for closing session manager */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onClick={() => setShowSessionManager(false)}
            />
            <div
              style={{
                position: 'absolute',
                top: '60px',
                left: '0',
                right: '0',
                margin: '0 20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: '#495057',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  📚 저장된 대화 ({sessions.length}/10)
                </h4>
                <button
                  onClick={handleNewConversation}
                  style={{
                    background: '#667eea',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#5a6fd8';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#667eea';
                  }}
                >
                  ➕ 새 대화
                </button>
              </div>
            </div>
            
            {sessions.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: '#6c757d',
                  fontSize: '13px',
                  padding: '20px',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.5 }}>
                  💬
                </div>
                <div>저장된 대화가 없습니다</div>
              </div>
            ) : (
              <div style={{ padding: '8px' }}>
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: session.id === currentSessionId ? '#f0f7ff' : 'transparent',
                      border: session.id === currentSessionId ? '1px solid #667eea' : '1px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      marginBottom: '4px',
                    }}
                    onClick={() => handleLoadSession(session)}
                    onMouseOver={(e) => {
                      if (session.id !== currentSessionId) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (session.id !== currentSessionId) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          color: session.id === currentSessionId ? '#1976d2' : '#333',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {session.title}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#6c757d',
                        }}
                      >
                        {new Date(session.lastUpdated).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#dc3545',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '11px',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#f8d7da';
                      }}
                      onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                      }}
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
        )}

        {/* API Key Input */}
        {showApiKeyInput && (
          <div
            style={{
              margin: '20px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🔑</span>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#495057',
                }}
              >
                OpenAI API 키를 입력하세요
              </p>
            </div>
            <p
              style={{
                margin: '0 0 12px 0',
                fontSize: '12px',
                color: '#6c757d',
              }}
            >
              💡 관리자가 이미 설정한 경우 별도 입력이 불필요합니다
            </p>
            <input
              type='password'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder='sk-...'
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = '#667eea')
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor = '#e9ecef')
              }
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
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  '#218838')
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  '#28a745')
              }
            >
              💾 저장
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div
          className={styles.aiChatMessages}
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            maxHeight: '400px',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '16px',
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                const copyBtn = (e.currentTarget as HTMLElement).querySelector('.copy-button') as HTMLElement;
                if (copyBtn) copyBtn.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                const copyBtn = (e.currentTarget as HTMLElement).querySelector('.copy-button') as HTMLElement;
                if (copyBtn) copyBtn.style.opacity = '0';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius:
                      msg.role === 'user'
                        ? '20px 20px 4px 20px'
                        : '20px 20px 20px 4px',
                    backgroundColor: msg.role === 'user' ? '#667eea' : '#f8f9fa',
                    color: msg.role === 'user' ? 'white' : '#333',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word',
                    position: 'relative',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                {msg.role === 'assistant' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🤖</span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6c757d',
                      }}
                    >
                      AI 가이드
                    </span>
                  </div>
                )}
                {renderMessage(msg.content, msg.role)}

                {/* 장소 카드 표시 */}
                {msg.places && msg.places.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6c757d',
                        marginBottom: '8px',
                      }}
                    >
                      📍 추천 장소 ({msg.places.length}곳)
                    </div>
                    {msg.places.map((place, idx) => (
                      <PlaceCard
                        key={place.id || idx}
                        place={place}
                        onPlaceClick={(p) => {
                          // 카드 클릭 시 모달 열기
                          if (onPlaceSelect) {
                            onPlaceSelect(p);
                            onClose(); // AI Chat 닫기
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
                </div>

                {/* 복사 버튼 - 메시지 아래에 위치 */}
                <button
                  className="copy-button"
                  onClick={() => handleCopyMessage(msg.content)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#6c757d',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    opacity: '0',
                    transition: 'opacity 0.2s ease',
                    marginTop: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.background = '#f0f0f0';
                    (e.target as HTMLButtonElement).style.color = '#495057';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'transparent';
                    (e.target as HTMLButtonElement).style.color = '#6c757d';
                  }}
                >
                  <span>📋</span>
                  <span>복사</span>
                </button>
              </div>
            </div>
          ))}
          {loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '20px 20px 20px 4px',
                  backgroundColor: '#f8f9fa',
                  color: '#6c757d',
                  fontSize: '14px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🤖</span>
                  <span style={{ fontWeight: '500' }}>AI 가이드</span>
                </div>
                <div
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#495057',
                  }}
                >
                  <span>답변을 준비하고 있어요</span>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                        animation: 'typing 1.4s infinite ease-in-out',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                        animation: 'typing 1.4s infinite ease-in-out 0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: '#667eea',
                        borderRadius: '50%',
                        animation: 'typing 1.4s infinite ease-in-out 0.4s',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts */}
        {showStarterPrompts && messages.length === 1 && (
          <div
            style={{
              padding: '20px',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafbfc',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#495057',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '16px' }}>✨</span>
                어떤 여행을 원하시나요?
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#6c757d',
                  opacity: 0.7,
                }}
              >
                숫자키로 빠른 선택
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
              {starterPrompts.map((prompt, index) => (
                <button
                  key={prompt.id}
                  onClick={() => handleStarterPrompt(prompt.prompt)}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor = '#667eea';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor = '#e9ecef';
                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.target as HTMLButtonElement).style.boxShadow = 'none';
                  }}
                  title={`키보드 단축키: ${index + 1}`}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ fontSize: '24px', lineHeight: '1' }}>{prompt.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#212529',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {prompt.title}
                        <span
                          style={{
                            background: '#667eea',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#6c757d',
                          lineHeight: '1.4',
                        }}
                      >
                        {prompt.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div
          style={{
            padding: '20px',
            borderTop: '1px solid #e9ecef',
            backgroundColor: '#fff',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}
          >
            <div style={{ flex: 1 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='제주도에 대해 물어보세요... (예: 맛집 추천해주세요)&#10;&#10;💡 Shift + Enter로 줄바꿈, Enter로 전송'
                style={{
                  width: '100%',
                  minHeight: '50px',
                  maxHeight: '120px',
                  padding: '14px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                  resize: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.4',
                  overflowY: 'auto',
                }}
                disabled={loading}
                onFocus={(e) =>
                  ((e.target as HTMLTextAreaElement).style.borderColor = '#667eea')
                }
                onBlur={(e) =>
                  ((e.target as HTMLTextAreaElement).style.borderColor = '#e9ecef')
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <button
              type='submit'
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
                height: '50px', // textarea의 minHeight와 동일
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                flexShrink: 0, // 버튼 크기 고정
              }}
              onMouseOver={(e) => {
                if (!loading && apiKey && input.trim()) {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    '#5a67d8';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && apiKey) {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    '#667eea';
                }
              }}
            >
              {!apiKey ? '🔑' : loading ? '⏳' : '🚀'}
              <span>{!apiKey ? 'API키' : loading ? '전송중' : '전송'}</span>
            </button>
          </form>

          {!apiKey && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#856404',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>⚠️</span>
              <span>
                채팅을 시작하려면 위의 ⚙️ 버튼을 클릭하여 OpenAI API 키를
                입력하세요.
              </span>
            </div>
          )}
        </div>

        {/* 토스트 메시지 */}
        {showToast && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              zIndex: 1002,
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            📋 메시지가 복사되었습니다!
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;
