import {
  faLocationArrow,
  faMousePointer,
  faMapMarkerAlt,
  faSearchLocation,
  faFilter,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fBase';
import { collection, onSnapshot } from 'firebase/firestore';
import Saychat from './Saychat';
import LoadingSpinner from './LoadingSpinner';
import AddMyPlace from './AddMyPlace';
import type { PlaceInfo } from '../types';

/* global kakao */

// 카카오 맵 API 타입 선언
interface KakaoMap {
  setCenter: (latlng: KakaoLatLng) => void;
  getLevel: () => number;
  setLevel: (level: number) => void;
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
        MarkerImage: new (src: string, size: KakaoSize, options?: { offset: KakaoPoint }) => KakaoMarkerImage;
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
  handleChangeDetail: (newDetail: PlaceInfo) => void;
  chatState: boolean;
}

const Map = ({ places, isMobile, handleChangeDetail, chatState }: MapProps) => {
  const [type, setType] = useState('전체');
  const [mouseState, setMouseState] = useState(false);
  const [currentPlace, setCurrentPlace] = useState({});
  const [geoLat, setGeoLat] = useState<number>(0);
  const [geoLon, setGeoLon] = useState<number>(0);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const preOverlayRef = useRef<KakaoOverlay | null>(null);
  const clustererRef = useRef<KakaoClusterer | null>(null);

  const clickHandler = (place: PlaceInfo) => {
    return function () {
      handleChangeDetail(place);
    };
  };

  const clickMobileHandler = (map: KakaoMap, overlay: KakaoOverlay, place: PlaceInfo) => {
    return function () {
      if (preOverlayRef.current) {
        preOverlayRef.current.setMap(null);
      }
      overlay.setMap(map);
      setCurrentPlace(place);
      setMouseState(true);
      preOverlayRef.current = overlay;
    };
  };

  const removeOverlay = (overlay: KakaoOverlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
    };
  };

  const mouseOverHandler = (map: KakaoMap, overlay: KakaoOverlay) => {
    return function () {
      overlay.setMap(map);
      setMouseState(true);
    };
  };

  const mouseOutHandler = (overlay: KakaoOverlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
    };
  };

  const makeMarker = useCallback((place: PlaceInfo) => {
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
      parseFloat(place.geocode[1])
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
        const markerPosition = marker.getPosition();
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
      window.kakao.maps.event.addListener(
        marker,
        'click',
        () => {
          addClickFeedback();
          clickMobileHandler(mapRef.current!, overlay, place)();
        },
      );
      window.kakao.maps.event.addListener(mapRef.current, 'click', removeOverlay(overlay));
    } else {
      window.kakao.maps.event.addListener(
        marker, 
        'click', 
        () => {
          addClickFeedback();
          clickHandler(place)();
        }
      );
      window.kakao.maps.event.addListener(
        marker,
        'mouseover',
        mouseOverHandler(mapRef.current!, overlay),
      );
      window.kakao.maps.event.addListener(
        marker,
        'mouseout',
        mouseOutHandler(overlay),
      );
    }

    return marker;
  }, [isMobile]);

  const makeMap = useCallback(() => {
    if (!container.current || !window.kakao?.maps) {
      setMapError('카카오 지도를 불러올 수 없습니다.');
      setIsMapLoading(false);
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(dbService, 'chats'), (snapshot) => {
      const chatArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatData[];
      paintChat(chatArray);
    });

    return () => unsubscribe();
  }, []);
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
          <div className='map-explain__container'>
            {mouseState ? (
              isMobile ? (
                <div className='marker__detail'>
                  <div className='marker__detail-header'>
                    <h4>{(currentPlace as PlaceInfo).name}</h4>
                    <div className='marker__detail-actions'>
                      <AddMyPlace 
                        place={currentPlace as PlaceInfo} 
                        size='small'
                      />
                      <Link
                        to={`/detail/${(currentPlace as PlaceInfo).name}`}
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
              ) : (
                <div className='map-explain explain-box'>
                  <div className='map-explain__content'>
                    <FontAwesomeIcon icon={faMousePointer} className='map-explain__icon' />
                    <span>더 알아보시려면 마커를 클릭해주세요.</span>
                  </div>
                  <Link to='/tips' className='map-explain__tips'>
                    <FontAwesomeIcon icon={faComments} />
                    장기여행자가 알려주는 HONEY TIPS
                  </Link>
                </div>
              )
            ) : (
              <div className='map-explain explain-box'>
                <div className='map-explain__content'>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className='map-explain__icon' />
                  <span>지도를 확대하실 수 있습니다.</span>
                </div>
                <Link to='/tips' className='map-explain__tips'>
                  <FontAwesomeIcon icon={faComments} />
                  장기여행자가 알려주는 HONEY TIPS
                </Link>
              </div>
            )}
          </div>
          {chatState && <Saychat latitude={geoLat} longitude={geoLon} />}
        </div>
      </div>
    </>
  );
};

export default Map;
