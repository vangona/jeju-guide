import {
  faLocationArrow,
  faMapMarkerAlt,
  faSearchLocation,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { dbService } from '../fBase';
import { collection, onSnapshot } from 'firebase/firestore';
import LoadingSpinner from './LoadingSpinner';
import AddMyPlace from './AddMyPlace';
import type { PlaceInfo } from '../types';

/* global kakao */

// 카카오 맵 API 타입 선언
interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
  relayout: () => void;
}

interface KakaoLatLng {
  getLat: () => number;
  getLng: () => number;
}

interface KakaoMarker {
  setMap: (map: KakaoMap | null) => void;
  getPosition: () => KakaoLatLng;
  getImage: () => KakaoMarkerImage;
}

interface KakaoMarkerImage {
  getSize: () => { width: number; height: number };
}

interface KakaoOverlay {
  setMap: (map: KakaoMap | null) => void;
}

interface KakaoClusterer {
  addMarkers: (markers: KakaoMarker[]) => void;
  clear: () => void;
}

interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

interface KakaoMarkerOptions {
  image?: KakaoMarkerImage;
  position: KakaoLatLng;
  map?: KakaoMap;
}

interface KakaoSize {
  width: number;
  height: number;
}

interface KakaoPoint {
  x: number;
  y: number;
}

interface KakaoOverlayOptions {
  content: HTMLElement;
  position: KakaoLatLng;
  yAnchor?: number;
  clickable?: boolean;
}

interface KakaoClustererOptions {
  map: KakaoMap;
  averageCenter?: boolean;
  minLevel?: number;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Marker: new (options: KakaoMarkerOptions) => KakaoMarker;
        MarkerImage: new (
          src: string,
          size: KakaoSize,
          options?: { offset: KakaoPoint },
        ) => KakaoMarkerImage;
        Size: new (width: number, height: number) => KakaoSize;
        Point: new (x: number, y: number) => KakaoPoint;
        CustomOverlay: new (options: KakaoOverlayOptions) => KakaoOverlay;
        MarkerClusterer: new (options: KakaoClustererOptions) => KakaoClusterer;
        event: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addListener: (target: any, type: string, handler: () => void) => void;
        };
      };
    };
  }
}

interface ChatData {
  id: string;
  text: string;
  location: [number, number];
  createdAt: number;
}

interface MapProps {
  places: PlaceInfo[];
  isMobile: boolean;
  handleChangeDetail: (newDetail: PlaceInfo | null) => void;
  chatState: boolean;
}

const Map = ({ places, isMobile, handleChangeDetail, chatState }: MapProps) => {
  const [type, setType] = useState('전체');
  const [mouseState, setMouseState] = useState(false);
  const [currentPlace, setCurrentPlace] = useState<PlaceInfo | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [geoLat, setGeoLat] = useState<number>(0);
  const [geoLon, setGeoLon] = useState<number>(0);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const preOverlayRef = useRef<KakaoOverlay | null>(null);
  const clustererRef = useRef<KakaoClusterer | null>(null);
  const labelsRef = useRef<KakaoOverlay[]>([]);

  const clickHandler = (place: PlaceInfo) => {
    return function () {
      handleChangeDetail(place);
    };
  };

  // const clickMobileHandler = (
  //   map: KakaoMap,
  //   overlay: KakaoOverlay,
  //   place: PlaceInfo,
  // ) => {
  //   return function () {
  //     if (preOverlayRef.current) {
  //       preOverlayRef.current.setMap(null);
  //     }
  //     overlay.setMap(map);
  //     setCurrentPlace(place);
  //     setMouseState(true);
  //     preOverlayRef.current = overlay;
  //   };
  // };

  const removeOverlay = (overlay: KakaoOverlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
    };
  };

  const mouseOverHandler = (overlay: KakaoOverlay, place: PlaceInfo) => {
    return function () {
      // 기존 카카오 오버레이는 숨김
      overlay.setMap(null);
      
      setMouseState(true);
      setCurrentPlace(place);
      
      // 마우스 이벤트 리스너 추가로 위치 추적
      const handleMouseMove = (e: MouseEvent) => {
        const tooltipWidth = 250;
        const tooltipHeight = 100;
        const padding = 16;
        const bottomPadding = isMobile ? 80 : padding;
        
        let x = e.clientX + padding;
        let y = e.clientY - tooltipHeight - padding;
        
        // 수직 위치 조정
        if (y < padding) {
          // 상단에 공간이 없으면 마우스 아래에 표시
          y = e.clientY + padding;
        } else if (y + tooltipHeight > window.innerHeight - bottomPadding) {
          // 하단에 공간이 없으면 위쪽으로 조정
          y = window.innerHeight - tooltipHeight - bottomPadding;
        }
        
        // 수평 위치 조정
        if (x + tooltipWidth > window.innerWidth - padding) {
          // 우측에 공간이 없으면 마우스 왼쪽에 표시
          x = e.clientX - tooltipWidth - padding;
        } else if (x < padding) {
          // 좌측에 공간이 없으면 오른쪽으로 조정
          x = padding;
        }
        
        setTooltipPosition({ x, y });
      };
      
      // 초기 위치를 화면 중앙으로 설정
      const initialX = window.innerWidth / 2;
      const initialY = window.innerHeight / 2;
      handleMouseMove({ clientX: initialX, clientY: initialY } as MouseEvent);
      
      // 마우스 움직임 추적
      document.addEventListener('mousemove', handleMouseMove);
      
      // 클린업을 위해 이벤트 리스너 제거 함수를 저장
      (window as any).tooltipMouseMoveHandler = handleMouseMove;
    };
  };

  const mouseOutHandler = (overlay: KakaoOverlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
      setCurrentPlace(null);
      
      // 마우스 이벤트 리스너 제거
      const handler = (window as any).tooltipMouseMoveHandler;
      if (handler) {
        document.removeEventListener('mousemove', handler);
        (window as any).tooltipMouseMoveHandler = null;
      }
    };
  };

  const makePlaceLabel = useCallback(
    (place: PlaceInfo) => {
      // 줌 레벨 10 이상: 마커만 표시 (라벨 없음)
      if (!isMobile || zoomLevel >= 10) return null;

      const position = new window.kakao.maps.LatLng(
        parseFloat(place.geocode['0']),
        parseFloat(place.geocode['1']),
      );

      const labelContent = document.createElement('div');
      labelContent.className = 'place__label-mobile';
      
      // 줌 레벨에 따른 콘텐츠 결정
      let innerHTML = '';
      
      if (zoomLevel <= 6) {
        // 줌 레벨 6 이하: 이름 + 카테고리 + 설명
        const displayName = place.name.length > 20 ? 
          place.name.substring(0, 20) + '...' : place.name;
        const displayDescription = place.description; // 글자 수 제한 제거
        
        innerHTML = `
          <div class="place__label-content-detailed">
            <div class="place__label-name">${displayName}</div>
            <div class="place__label-type">${place.type}</div>
            ${displayDescription ? `<div class="place__label-description">${displayDescription}</div>` : ''}
          </div>
        `;
      } else if (zoomLevel >= 7) {
        // 줌 레벨 7 이상 9 이하: 이름만
        const displayName = place.name.length > 15 ? 
          place.name.substring(0, 15) + '...' : place.name;
        
        innerHTML = `<span class="place__label-text">${displayName}</span>`;
      }
      
      labelContent.innerHTML = innerHTML;

      const labelOverlay = new window.kakao.maps.CustomOverlay({
        content: labelContent,
        position,
        yAnchor: -0.5, // 마커 아래쪽에 위치
        clickable: true,
      });

      // 라벨 클릭 시 상세 정보 표시
      labelContent.addEventListener('click', () => {
        handleChangeDetail(place);
      });

      return labelOverlay;
    },
    [isMobile, zoomLevel, handleChangeDetail],
  );

  const updatePlaceLabels = useCallback(() => {
    // 기존 라벨들 제거
    labelsRef.current.forEach(label => label.setMap(null));
    labelsRef.current = [];

    if (!isMobile || zoomLevel >= 10 || !mapRef.current) return;

    // 필터링된 장소들에 대해 라벨 생성
    const filteredPlaces = places.filter(place => {
      if (type === '전체') return true;
      return place.type === type;
    });

    filteredPlaces.forEach(place => {
      const label = makePlaceLabel(place);
      if (label) {
        label.setMap(mapRef.current!);
        labelsRef.current.push(label);
      }
    });
  }, [isMobile, zoomLevel, places, type, makePlaceLabel]);

  const makeMarker = useCallback(
    (place: PlaceInfo) => {
      const content = document.createElement('div');
      content.className = 'place__infowindow';
      content.innerHTML = `
      <div class="infowindow__content">
        <h5 class="infowindow__title">${place.name}</h5>
        <span class="infowindow__type">${place.type}</span>
      </div>
    `;

      const position = new window.kakao.maps.LatLng(
        parseFloat(place.geocode[0]),
        parseFloat(place.geocode[1]),
      );
      const overlay = new window.kakao.maps.CustomOverlay({
        content,
        position,
        yAnchor: 2.5,
        clickable: true,
      });

      let imageIconLocation = '';

      if (place.type === '맛집') {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/restaurant.png';
      } else if (place.type === '카페 & 베이커리') {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/cafe.png';
      } else if (place.type === '숙소') {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/hotel.png';
      } else if (place.type === '술집') {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/drink.png';
      } else if (place.type === '풍경') {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/landscape.png';
      } else {
        imageIconLocation =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/basic.png';
      }

      const imageSrc = imageIconLocation,
        imageSize = new window.kakao.maps.Size(40, 40),
        imageOption = { offset: new window.kakao.maps.Point(20, 40) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      const marker = new window.kakao.maps.Marker({
        image: markerImage,
        position,
      });

      // Add click feedback animation
      const addClickFeedback = () => {
        const markerEl = marker.getImage();
        if (markerEl) {
          // Add a subtle scale animation on click
          const clickFeedback = document.createElement('div');
          clickFeedback.className = 'marker-click-feedback';
          clickFeedback.style.cssText = `
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: markerPulse 0.6s ease-out;
          pointer-events: none;
          z-index: 1000;
        `;
          document.body.appendChild(clickFeedback);
          setTimeout(() => clickFeedback.remove(), 600);
        }
      };

      if (isMobile) {
        window.kakao.maps.event.addListener(marker, 'click', () => {
          addClickFeedback();
          clickHandler(place)();
        });
        window.kakao.maps.event.addListener(
          mapRef.current,
          'click',
          removeOverlay(overlay),
        );
      } else {
        window.kakao.maps.event.addListener(marker, 'click', () => {
          addClickFeedback();
          clickHandler(place)();
        });
        window.kakao.maps.event.addListener(
          marker,
          'mouseover',
          mouseOverHandler(overlay, place),
        );
        window.kakao.maps.event.addListener(
          marker,
          'mouseout',
          mouseOutHandler(overlay),
        );
      }

      return marker;
    },
    [isMobile],
  );

  const makeMap = useCallback(() => {
    if (!container.current) {
      setMapError('지도 컨테이너를 찾을 수 없습니다.');
      setIsMapLoading(false);
      return;
    }

    if (!window.kakao?.maps) {
      console.log('카카오맵 API 로딩 중...');
      // 카카오맵 API가 로드될 때까지 대기
      const checkKakaoLoaded = () => {
        if (window.kakao?.maps) {
          makeMap();
        } else {
          setTimeout(checkKakaoLoaded, 100);
        }
      };
      checkKakaoLoaded();
      return;
    }

    try {
      const level = isMobile ? 11 : 10;
      const options = {
        center: new window.kakao.maps.LatLng(33.3717, 126.5602),
        level,
      };

      mapRef.current = new window.kakao.maps.Map(container.current, options);
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: mapRef.current,
        averageCenter: true,
        minLevel: 9,
      });

      // 줌 레벨 변경 이벤트 리스너 추가
      window.kakao.maps.event.addListener(mapRef.current, 'zoom_changed', () => {
        if (mapRef.current) {
          const currentZoom = mapRef.current.getLevel();
          console.log('현재 줌 레벨:', currentZoom);
          setZoomLevel(currentZoom);
        }
      });

      // 초기 줌 레벨 설정
      const initialZoom = mapRef.current.getLevel();
      console.log('초기 줌 레벨:', initialZoom);
      setZoomLevel(initialZoom);

      setIsMapLoading(false);
      setMapError(null);
    } catch (error) {
      setMapError('지도 초기화에 실패했습니다.');
      setIsMapLoading(false);
    }
  }, [isMobile]);

  const onTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = event;
    setType(value);
  };

  const onClickLocation = () => {
    const displayMarker = (locPosition: KakaoLatLng) => {
      const imageSrc =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/tourist.png',
        imageSize = new window.kakao.maps.Size(25, 25),
        imageOption = { offset: new window.kakao.maps.Point(12.5, 25) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      const locationMarker = new window.kakao.maps.Marker({
        image: markerImage,
        position: locPosition,
      });

      if (mapRef.current) {
        locationMarker.setMap(mapRef.current);
      }
    };
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도

        setGeoLat(lat);
        setGeoLon(lon);

        const locPosition = new window.kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      alert('위치 정보를 이용할 수 없습니다.');
    }
  };

  const paintChat = (chats: ChatData[]) => {
    if (chats && chats.length > 0 && mapRef.current) {
      const latestChat = chats[chats.length - 1];
      const content = document.createElement('div');
      content.className = 'place__infowindow';
      content.innerHTML = `${latestChat.text}`;
      const position = new window.kakao.maps.LatLng(
        latestChat.location[0],
        latestChat.location[1],
      );
      const chatWindow = new window.kakao.maps.CustomOverlay({
        content,
        position,
        yAnchor: 2.5,
        clickable: true,
      });
      chatWindow.setMap(mapRef.current);
      setTimeout(() => {
        chatWindow.setMap(null);
      }, 3000);
    }
  };

  useEffect(() => {
    makeMap();
  }, [makeMap]);

  useEffect(() => {
    if (!mapRef.current || !clustererRef.current) return;

    const markers: KakaoMarker[] = [];
    clustererRef.current.clear();

    places.forEach((place) => {
      if (type === '전체' || place.type === type) {
        const marker = makeMarker(place);
        markers.push(marker);
      }
    });

    if (markers.length > 0) {
      clustererRef.current.addMarkers(markers);
    }
  }, [type, places, makeMarker]);

  // 라벨 업데이트 useEffect
  useEffect(() => {
    updatePlaceLabels();
  }, [updatePlaceLabels]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(dbService, 'chats'),
      (snapshot) => {
        const chatArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ChatData[];
        paintChat(chatArray);
      },
    );

    return () => unsubscribe();
  }, []);

  // Handle map resizing for responsive design
  useEffect(() => {
    if (!mapRef.current) return;

    let resizeTimeout: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.relayout();
        }
      }, 250); // Debounce resize events
    };

    // Listen for window resize events with debouncing
    window.addEventListener('resize', handleResize);

    // Only trigger initial resize on mount, not on every isMobile change
    if (mapRef.current) {
      handleResize();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []); // Remove isMobile dependency to prevent continuous re-renders
  if (mapError) {
    return (
      <div className='map__container map__container--error'>
        <div className='map__error'>
          <FontAwesomeIcon icon={faMapMarkerAlt} size='2x' />
          <p>{mapError}</p>
          <button onClick={makeMap} className='btn-retry'>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='map__container'>
        <div className='vertical'>
          <div className='map__controls'>
            <div className='map__filter-group'>
              <FontAwesomeIcon icon={faFilter} className='map__filter-icon' />
              <select
                className='place-type__map'
                name='input__place-type'
                onChange={onTypeChange}
                value={type}
              >
                <option value='전체'>전체</option>
                <option value='맛집'>맛집</option>
                <option value='카페 & 베이커리'>카페 & 베이커리</option>
                <option value='풍경'>풍경</option>
                <option value='술집'>술집</option>
                <option value='숙소'>숙소</option>
                <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
              </select>
            </div>
            <button
              className='check-geolocation'
              onClick={onClickLocation}
              title='현재 위치 표시'
            >
              <FontAwesomeIcon icon={faLocationArrow} />
              <span className='btn-text'>현재 위치</span>
            </button>
          </div>
          <div className='map__wrapper'>
            {isMapLoading && (
              <div className='map__loading'>
                <LoadingSpinner message='지도를 불러오고 있습니다...' />
              </div>
            )}
            <div className='map' ref={container}></div>
          </div>
          {/* Mobile marker detail when clicked */}
          {mouseState && isMobile && (
            <div className='marker__detail'>
              <div className='marker__detail-header'>
                <h4>{(currentPlace as PlaceInfo).name}</h4>
                <div className='marker__detail-actions'>
                  <AddMyPlace place={currentPlace as PlaceInfo} size='small' />
                  <Link
                    href={`/detail/${(currentPlace as PlaceInfo).name}`}
                    className='btn-detail'
                  >
                    <FontAwesomeIcon icon={faSearchLocation} />
                  </Link>
                </div>
              </div>
              <p className='marker__detail-description'>
                {(currentPlace as PlaceInfo).description.slice(0, 50)}
                {(currentPlace as PlaceInfo).description.length > 50 && '...'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* 고정 위치 툴팁 - 데스크톱용 */}
      {!isMobile && mouseState && currentPlace && (
        <div
          className="place__tooltip-fixed"
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 1001,
            pointerEvents: 'none', // 마우스 이벤트 방지
          }}
        >
          <div className="place__tooltip-content">
            <h5 className="place__tooltip-title">{currentPlace.name}</h5>
            <span className="place__tooltip-type">{currentPlace.type}</span>
            {currentPlace.description && (
              <p className="place__tooltip-description">
                {currentPlace.description.slice(0, 60)}
                {currentPlace.description.length > 60 && '...'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Map);
