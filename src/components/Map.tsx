// @ts-nocheck
// TODO: kakao 맵의 type 체크하고 ts-nocheck 풀기

import {
  faLocationArrow,
  faMousePointer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../fBase';
import Saychat from './Saychat';
import type { PlaceInfo } from '../types';

/* global kakao */

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
  const [geoLat, setGeoLat] = useState('');
  const [geoLon, setGeoLon] = useState('');
  const container = useRef(null);
  let map;
  let preOverlay = '';
  let clusterer;

  const clickHandler = (place: PlaceInfo) => {
    return function () {
      handleChangeDetail(place);
    };
  };

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

  const removeOverlay = (overlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
    };
  };

  const mouseOverHandler = (map, overlay) => {
    return function () {
      overlay.setMap(map);
      setMouseState(true);
    };
  };

  const mouseOutHandler = (overlay) => {
    return function () {
      overlay.setMap(null);
      setMouseState(false);
    };
  };

  const onTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setType(value);
  };

  const onClickLocation = () => {
    const displayMarker = (locPosition) => {
      const imageSrc =
          'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/tourist.png',
        imageSize = new kakao.maps.Size(25, 25),
        imageOption = { offset: new kakao.maps.Point(12.5, 25) };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      new kakao.maps.Marker({
        map: map,
        image: markerImage,
        position: locPosition,
      });
    };
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude; // 위도
        const lon = position.coords.longitude; // 경도

        setGeoLat(lat);
        setGeoLon(lon);

        const locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      alert('위치 정보를 이용할 수 없습니다.');
    }
  };

  const makeMarker = useCallback(
    (place) => {
      const content = document.createElement('div');
      content.className = 'place__infowindow';
      content.innerHTML = `${place.name}`;

      const position = new kakao.maps.LatLng(
        place.geocode[0],
        place.geocode[1],
      );
      const overlay = new kakao.maps.CustomOverlay({
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
        imageSize = new kakao.maps.Size(35, 35),
        imageOption = { offset: new kakao.maps.Point(17.5, 35) };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      const marker = new kakao.maps.Marker({
        image: markerImage,
        position,
      });

      if (isMobile) {
        kakao.maps.event.addListener(
          marker,
          'click',
          clickMobileHandler(map, overlay, place),
        );
        kakao.maps.event.addListener(map, 'click', removeOverlay(overlay));
      } else {
        kakao.maps.event.addListener(marker, 'click', clickHandler(place));
        kakao.maps.event.addListener(
          marker,
          'mouseover',
          mouseOverHandler(map, overlay),
        );
        kakao.maps.event.addListener(
          marker,
          'mouseout',
          mouseOutHandler(overlay),
        );
      }

      return marker;
    },
    [map, clickHandler, clickMobileHandler, isMobile],
  );

  // TODO: 리팩토링 필요
  const makeMap = useCallback(() => {
    let level = 10;
    if (isMobile) {
      level = 11;
    }
    const options = {
      center: new kakao.maps.LatLng(33.3717, 126.5602), //지도의 중심좌표.
      level,
    };
    map = new window.kakao.maps.Map(container.current, options);
    clusterer = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 9,
    });
  }, []);

  const paintChat = useCallback(
    (chats) => {
      if (chats !== false) {
        const latestChat = chats[chats.length - 1];
        const content = document.createElement('div');
        content.className = 'place__infowindow';
        content.innerHTML = `${latestChat.text}`;
        const position = new kakao.maps.LatLng(
          latestChat.location[0],
          latestChat.location[1],
        );
        const chatWindow = new kakao.maps.CustomOverlay({
          content,
          position,
          yAnchor: 2.5,
          clickable: true,
        });
        chatWindow.setMap(map);
        setTimeout(() => {
          chatWindow.setMap(null);
        }, 3000);
      }
    },
    [map],
  );

  useEffect(() => {
    const markers = [];

    dbService.collection('chats').onSnapshot((snapshot) => {
      const chatArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      paintChat(chatArray);
    });

    makeMap();
    places.map((place) => {
      if (type === '전체' || place.type === type) {
        makeMarker(place);
        markers.push(makeMarker(place));
      }
    });
    clusterer.addMarkers(markers);
  }, [type, places, clusterer, makeMap, makeMarker, paintChat]);
  return (
    <>
      <div className='map__container'>
        <div className='vertical'>
          <select
            className='place-type__map'
            name='input__place-type'
            onChange={onTypeChange}
          >
            <option value='전체'>전체</option>
            <option value='맛집'>맛집</option>
            <option value='카페 & 베이커리'>카페 & 베이커리</option>\
            <option value='풍경'>풍경</option>
            <option value='술집'>술집</option>
            <option value='숙소'>숙소</option>
            <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
          </select>
          <div>
            <button className='check-geolocation' onClick={onClickLocation}>
              <FontAwesomeIcon icon={faLocationArrow} /> 현재 위치 표시하기
            </button>
          </div>
          <div className='map' ref={container}></div>
          <div className='map-explain__container'>
            {mouseState ? (
              isMobile ? (
                <Link
                  to={{
                    pathname: `/detail/${currentPlace.name}`,
                    state: {
                      from: '지도',
                    },
                  }}
                >
                  <div className='marker__detail'>
                    <h4>
                      {currentPlace.name}{' '}
                      <FontAwesomeIcon icon={faMousePointer} size='sm' />
                    </h4>
                    <hr />
                    <p>
                      {currentPlace.description.slice(0, 50)}
                      {currentPlace.description.length > 50 && '...'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className='map-explain explain-box'>
                  <span>더 알아보시려면 마커를 클릭해주세요.</span> <br />
                  <Link to='/tips'>
                    <div className='map-explain__tips'>
                      장기여행자가 알려주는 HONEY TIPS
                    </div>
                  </Link>
                </div>
              )
            ) : (
              <div className='map-explain explain-box'>
                <span>지도를 확대하실 수 있습니다.</span> <br />
                <Link to='/tips'>
                  <div className='map-explain__tips'>
                    장기여행자가 알려주는 HONEY TIPS
                  </div>
                </Link>
              </div>
            )}
          </div>
          {chatState && <Saychat lat={geoLat} lon={geoLon} />}
        </div>
      </div>
    </>
  );
};

export default Map;
