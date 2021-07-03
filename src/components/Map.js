import { faLocationArrow, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* global kakao */

const Map = ({places, isMobile, setDetail}) => {
    const [type, setType] = useState("전체");
    const [mouseState, setMouseState] = useState(false);
    const [currentPlace, setCurrentPlace] = useState({});
    const container = useRef(null);
    let map = {};

    const clickHandler = (place) => {
        return function () {
            setDetail(place)
        }
    }

    const clickMobileHandler = (map, overlay, place) => {
        return function () {
            overlay.setMap(map);
            setCurrentPlace(place)
            setMouseState(true)
        }
    }

    const removeOverlay = (overlay) => {
        return function () {
            overlay.setMap(null)
            setMouseState(false)
        }
    }

    const mouseOverHandler = (map, overlay) => {
        return function () {
            overlay.setMap(map);
            setMouseState(true)
        }
    };

    const mouseOutHandler = (overlay) => {
        return function () {
            overlay.setMap(null)
            setMouseState(false)
        }
    };

    const makeMarker = (place) => {
        const content = document.createElement('div');
        content.className = 'place__infowindow';
        content.innerHTML = `${place.name}`;

        const position = new kakao.maps.LatLng(place.geocode[0], place.geocode[1])
        const overlay = new kakao.maps.CustomOverlay({
            content,
            position,
            yAnchor: 2.5,
            clickable: true,
        })

        const marker = new kakao.maps.Marker({
            map: map,
            position
        });

        if (isMobile) {
            kakao.maps.event.addListener(marker, 'click', clickMobileHandler(map, overlay, place));
            kakao.maps.event.addListener(map, "click", removeOverlay(overlay))
        } else {
            kakao.maps.event.addListener(marker, 'click', clickHandler(place));
            kakao.maps.event.addListener(marker, 'mouseover', mouseOverHandler(map, overlay));
            kakao.maps.event.addListener(marker, 'mouseout', mouseOutHandler(overlay));
        }
    }

    const makeMap = () => {
        let level = 10;
        if (isMobile) {
            level = 11
        }
        const options = {
            center: new kakao.maps.LatLng(33.3517, 126.5602), //지도의 중심좌표.
            level
        }
        map = new window.kakao.maps.Map(container.current, options);
    }

    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }

    const onClickLocation = () => {
        const displayMarker = (locPosition) => {
            const imageSrc = 'https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/tourist.png',
                imageSize = new kakao.maps.Size(25, 25),
                imageOption = {offset: new kakao.maps.Point(27, 69)};    

            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            const marker = new kakao.maps.Marker({
                map: map,
                image: markerImage,
                position: locPosition
            })
        }
        if (navigator.geolocation) {
    
            // GeoLocation을 이용해서 접속 위치를 얻어옵니다
            navigator.geolocation.getCurrentPosition(function(position) {
                
                var lat = position.coords.latitude, // 위도
                    lon = position.coords.longitude; // 경도
                
                var locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                
                // 마커와 인포윈도우를 표시합니다
                displayMarker(locPosition);
                    
              });
            
        } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
            
            alert("위치 정보를 이용할 수 없습니다.")
        }
    }

    useEffect(() => {
        makeMap();
        places.map(place => {
            if(type === "전체" || place.type === type) {
                makeMarker(place)
            }
        })
    }, [type]);
    return (
        <>
            <div className="map__container">
                <div className="vertical">
                    <select className="place-type__map" name="input__place-type" onChange={onTypeChange} >
                            <option value="전체">전체</option>
                            <option value="맛집">맛집</option>
                            <option value="카페 & 베이커리">카페 & 베이커리</option>\
                            <option value="풍경">풍경</option>
                            <option value="술집">술집</option>
                            <option value="그 외 가볼만한 곳">그 외 가볼만한 곳</option>
                        </select>
                    <div>
                        <button className="check-geolocation" onClick={onClickLocation}><FontAwesomeIcon icon={faLocationArrow} /> 현재 위치 표시하기</button>
                    </div>
                    <div className="map" ref={container} ></div>
                    <div className="map-explain__container">{mouseState 
                    ? isMobile 
                    ? 
                    <Link to={{
                        pathname: "/detail",
                        state: {
                            from: "지도",
                            place: currentPlace
                        }
                    }}>
                    <div className="marker__detail">
                        <h4>{currentPlace.name} <FontAwesomeIcon icon={faMousePointer} size="sm"/></h4>
                        <hr/>
                        <p>{currentPlace.description.slice(0, 50)}{currentPlace.description.length > 50 && "..."}</p>
                    </div> 
                    </Link>
                    : <div className="map-explain explain-box">
                        <span>더 알아보시려면 마커를 클릭해주세요.</span> <br />
                        <Link to="/tips"><div className="map-explain__tips">장기여행자가 알려주는 HONEY TIPS</div></Link>
                    </div> 
                    : <div className="map-explain explain-box">
                        <span>지도를 확대하실 수 있습니다.</span> <br />
                        <Link to="/tips"><div className="map-explain__tips">장기여행자가 알려주는 HONEY TIPS</div></Link>
                     </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Map;