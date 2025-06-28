/**
 * 반응형 지도 컴포넌트 - 개선된 버전
 * 기존의 isMobile props 대신 CSS와 컨테이너 쿼리 활용
 */

// @ts-nocheck
// TODO: kakao 맵의 type 체크하기

import {
  faLocationArrow,
  faMousePointer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fBase';
import { collection, onSnapshot } from 'firebase/firestore';
import {
  useResponsive,
  useContainerQuery,
  useNetworkOptimization,
} from '../hooks/useResponsive';
import type { PlaceInfo } from '../types';

/* global kakao */

interface ResponsiveMapProps {
  places: PlaceInfo[];
  handleChangeDetail: (newDetail: PlaceInfo) => void;
  chatState: boolean;
}

const ResponsiveMap = ({
  places,
  handleChangeDetail,
  chatState,
}: ResponsiveMapProps) => {
  const [type, setType] = useState('전체');
  const [mouseState, setMouseState] = useState(false);
  const [currentPlace, setCurrentPlace] = useState({});
  const [geoLat, setGeoLat] = useState('');
  const [geoLon, setGeoLon] = useState('');

  // 반응형 처리
  const deviceInfo = useResponsive();
  const networkInfo = useNetworkOptimization();
  const container = useRef(null);
  const mapContainerRef = useRef(null);
  const { containerWidth, isContainerMobile } =
    useContainerQuery(mapContainerRef);

  let map;
  let preOverlay = '';
  let clusterer;

  // 터치 디바이스에서의 클릭 핸들러
  const clickHandler = (place: PlaceInfo) => {
    return function () {
      handleChangeDetail(place);
    };
  };

  // 모바일 전용 클릭 핸들러 (컨테이너 크기 기반)
  const clickMobileHandler = (map, overlay, place) => {
    return function () {
      if (preOverlay !== '') {
        preOverlay.setMap(null);
      }
      overlay.setMap(map);
      setCurrentPlace(place);
      setMouseState(true);
      preOverlay = overlay;
    };
  };

  // 지도 옵션을 반응형으로 조정
  const getMapOptions = () => {
    const baseOptions = {
      center: new kakao.maps.LatLng(33.3590628, 126.534361),
      level: 8,
    };

    // 컨테이너 크기에 따른 줌 레벨 조정
    if (isContainerMobile || deviceInfo.isMobile) {
      return {
        ...baseOptions,
        level: 9, // 모바일에서는 더 넓은 영역 표시
      };
    }

    if (deviceInfo.isTablet) {
      return {
        ...baseOptions,
        level: 8,
      };
    }

    return baseOptions;
  };

  // 지도 크기를 반응형으로 계산
  const getMapSize = () => {
    if (isContainerMobile || deviceInfo.isMobile) {
      return {
        width: '100%',
        minWidth: '320px',
        height: '280px',
      };
    }

    if (deviceInfo.isTablet) {
      return {
        width: '100%',
        minWidth: '600px',
        height: '400px',
      };
    }

    return {
      width: '100%',
      minWidth: '700px',
      height: '450px',
      maxWidth: '95vw',
    };
  };

  const showMap = () => {
    const mapOptions = getMapOptions();
    map = new kakao.maps.Map(container.current, mapOptions);

    // 클러스터러 설정 - 모바일에서는 더 간소화
    clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: deviceInfo.isMobile ? 2 : 1,
      disableClickZoom: deviceInfo.hasTouch, // 터치 디바이스에서는 클릭 줌 비활성화
      styles: [
        {
          width: deviceInfo.isMobile ? '40px' : '53px',
          height: deviceInfo.isMobile ? '40px' : '52px',
          background: 'rgba(51, 204, 255, .8)',
          borderRadius: '25px',
          color: '#000',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: deviceInfo.isMobile ? '40px' : '53px',
        },
      ],
    });

    const markers = [];

    places
      .filter((place) => type === '전체' || place.type === type)
      .forEach((place) => {
        const markerPosition = new kakao.maps.LatLng(place.lat, place.lon);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });

        const infoContent = `
          <div class="place__infowindow">
            <div><strong>${place.name}</strong></div>
            <hr />
            <div>${place.address}</div>
          </div>
        `;

        const infoWindow = new kakao.maps.InfoWindow({
          content: infoContent,
        });

        // 터치 디바이스와 데스크톱에서 다른 인터랙션 제공
        if (deviceInfo.hasTouch || deviceInfo.isMobile) {
          // 터치 디바이스: 탭으로 정보창 표시/숨김
          kakao.maps.event.addListener(
            marker,
            'click',
            clickMobileHandler(map, infoWindow, place),
          );
        } else {
          // 데스크톱: 마우스 오버/아웃으로 정보창 제어
          kakao.maps.event.addListener(marker, 'mouseover', function () {
            infoWindow.open(map, marker);
          });

          kakao.maps.event.addListener(marker, 'mouseout', function () {
            infoWindow.close();
          });

          kakao.maps.event.addListener(marker, 'click', clickHandler(place));
        }

        markers.push(marker);
      });

    clusterer.addMarkers(markers);

    // 성능 최적화: 느린 연결에서는 애니메이션 비활성화
    if (networkInfo.isSlowConnection) {
      map.setDraggable(false);
      map.setZoomable(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLat(position.coords.latitude.toString());
          setGeoLon(position.coords.longitude.toString());

          const moveLatLon = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );
          map.setCenter(moveLatLon);

          // 모바일에서는 현재 위치로 이동 시 적절한 줌 레벨 설정
          if (deviceInfo.isMobile) {
            map.setLevel(6);
          }
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
        },
        {
          enableHighAccuracy: !networkInfo.isSlowConnection, // 느린 연결에서는 정확도보다 속도 우선
          timeout: networkInfo.isSlowConnection ? 10000 : 5000,
          maximumAge: 300000, // 5분 캐시
        },
      );
    }
  };

  useEffect(() => {
    if (places.length > 0) {
      showMap();
    }
  }, [places, type, deviceInfo.isMobile]);

  const mapSize = getMapSize();

  return (
    <div className='map__container' ref={mapContainerRef}>
      <div className='map-container-responsive'>
        {/* 지도 타입 선택 - 모바일에서는 더 간소화 */}
        <div className='map-radio__container'>
          {['전체', '관광지', '맛집', '카페', '숙소'].map((placeType) => (
            <label key={placeType} className='place-type__map'>
              <input
                type='radio'
                name='placeType'
                value={placeType}
                checked={type === placeType}
                onChange={(e) => setType(e.target.value)}
              />
              {placeType}
            </label>
          ))}
        </div>

        {/* 지도 컨테이너 */}
        <div
          ref={container}
          className='map'
          style={mapSize}
          role='application'
          aria-label='제주도 관광지 지도'
        />

        {/* 현재 위치 버튼 - 터치 최적화 */}
        <button
          className={`check-geolocation touch-target ${deviceInfo.hasTouch ? 'touch-optimized' : ''}`}
          onClick={handleCurrentLocation}
          aria-label='현재 위치로 이동'
          type='button'
        >
          <FontAwesomeIcon icon={faLocationArrow} />
          {!deviceInfo.isMobile && ' 현재 위치'}
        </button>

        {/* 모바일에서 선택된 장소 정보 표시 */}
        {deviceInfo.isMobile && mouseState && (
          <div className='marker__detail'>
            <Link
              to={`/detail/${currentPlace.id}`}
              onClick={() => setMouseState(false)}
            >
              <div>{currentPlace.name}</div>
              <hr />
              <div>{currentPlace.address}</div>
              <div>
                <FontAwesomeIcon icon={faMousePointer} /> 자세히 보기
              </div>
            </Link>
          </div>
        )}

        {/* 설명 텍스트 - 반응형 */}
        <div className='map-explain__container'>
          <div className='explain-box'>
            <div className='map-explain'>
              {deviceInfo.isMobile
                ? '마커를 탭하여 정보를 확인하세요.'
                : '마커에 마우스를 올려 정보를 확인하고, 클릭하면 상세 정보를 볼 수 있습니다.'}
            </div>
            {!networkInfo.isSlowConnection && (
              <div className='map-explain__tips'>
                💡{' '}
                {deviceInfo.isMobile
                  ? '핀치로 확대/축소'
                  : '마우스 휠로 확대/축소'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveMap;
