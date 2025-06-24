import React from 'react';
import type { PlaceInfo } from '../types';

interface PlaceCardProps {
  place: PlaceInfo;
  onPlaceClick?: (place: PlaceInfo) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPlaceClick }) => {
  
  const handleClick = () => {
    if (onPlaceClick) {
      onPlaceClick(place);
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 모달 열기 - onPlaceClick과 동일한 동작
    if (onPlaceClick) {
      onPlaceClick(place);
    }
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (place.url) {
      window.open(place.url, '_blank');
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${place.name}\n${place.address}\n${place.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: shareText,
        url: place.url || `https://map.kakao.com/link/search/${encodeURIComponent(place.name)}`
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(shareText).then(() => {
        alert('장소 정보가 클립보드에 복사되었습니다!');
      });
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        border: '1px solid #e9ecef',
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        fontSize: '13px'
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* 이미지 영역 */}
        {place.attachmentUrlArray && place.attachmentUrlArray.length > 0 ? (
          <img 
            src={place.attachmentUrlArray[0]} 
            alt={place.name}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {place.type === 'restaurant' ? '🍽️' : 
             place.type === 'cafe' ? '☕' :
             place.type === 'hotel' ? '🏨' :
             place.type === 'tourist' ? '🏛️' :
             place.type === 'landscape' ? '🏞️' : '📍'}
          </div>
        )}
        
        {/* 정보 영역 */}
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            margin: '0 0 6px 0', 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#333'
          }}>
            {place.name}
          </h4>
          
          <p style={{ 
            margin: '0 0 4px 0', 
            fontSize: '13px', 
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>📍</span> {place.address}
          </p>
          
          <p style={{ 
            margin: '0', 
            fontSize: '13px', 
            color: '#495057',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {place.description}
          </p>
          
          <div style={{ 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{
              fontSize: '11px',
              padding: '3px 8px',
              backgroundColor: '#667eea',
              color: 'white',
              borderRadius: '12px'
            }}>
              {place.type === 'restaurant' ? '맛집' : 
               place.type === 'cafe' ? '카페' :
               place.type === 'hotel' ? '숙소' :
               place.type === 'tourist' ? '관광지' :
               place.type === 'landscape' ? '자연경관' : '기타'}
            </span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleMapClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                }}
                title="지도에서 보기"
              >
                🗺️ 지도
              </button>
              
              {place.url && (
                <button
                  onClick={handleWebsiteClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                  }}
                  title="웹사이트 방문"
                >
                  🔗 사이트
                </button>
              )}
              
              <button
                onClick={handleShareClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: '#ff6b6b',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
                }}
                title="공유하기"
              >
                📤 공유
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;