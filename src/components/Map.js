import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

/* global kakao */

const Map = ({places, isMobile}) => {
    const history = useHistory();
    const [type, setType] = useState("전체");
    const [detail, setDetail] = useState(null);
    const [imgPage, setImgPage] = useState(0);
    const [mouseState, setMouseState] = useState(false);
    const container = useRef(null);
    let map = {};

    const clickNextImg = () => {
        if (imgPage < 4) {
            setImgPage(prev => prev + 1);
        }
    }

    const clickPrevImg = () => {
        if (imgPage > 0) {
            setImgPage(prev => prev - 1);
        }
    }

    const clickHandler = (place) => {
        return function () {
            setDetail(place)
        }
    }

    const clickMobileHandler = (map, overlay) => {
        return function () {
            overlay.setMap(map);
            setMouseState(true)
        }
    }

    const removeOverlay = (overlay) => {
        return function () {
            overlay.setMap(null)
            setMouseState(false)
        }
    }

    const clickOverlayHandler = (place) => {
        return function () {
            history.push({
                pathname: "/detail",
                state: {
                    from: "지도",
                    place
                }
            })
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
    const addEventHandle = (target, type, callback) => {
        if (target.addEventListener) {
            target.addEventListener(type, callback);
        } else {
            target.attachEvent('on' + type, callback);
        }
    }

    const makeMarker = (place) => {
        const content = document.createElement('div');
        content.className = 'place__infowindow'
        content.innerHTML = `${place.name}`      

        const position = new kakao.maps.LatLng(place.geocode[0], place.geocode[1])
        const overlay = new kakao.maps.CustomOverlay({
            content,
            position,
            yAnchor: 2,
            clickable: true,
        })

        const marker = new kakao.maps.Marker({
            map: map,
            position
        });

        if (isMobile) {
            kakao.maps.event.addListener(marker, 'click', clickMobileHandler(map, overlay));
            kakao.maps.event.addListener(map, "click", removeOverlay(overlay))
            addEventHandle(content, "click", clickOverlayHandler(place))
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
            center: new kakao.maps.LatLng(33.3817, 126.5602), //지도의 중심좌표.
            level
        }
        map = new window.kakao.maps.Map(container.current, options);
    }

    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }

    const onClickClear = () => {
        setDetail(null);
    }

    const onClickLocation = () => {
        const displayMarker = (locPosition) => {
            const marker = new kakao.maps.Marker({
                map: map,
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
                    <span className="map-explain__container">{mouseState 
                    ? isMobile 
                    ? <div className="map-explain">더 알아보시려면 이름을 클릭해주세요.</div> 
                    : <div className="map-explain">더 알아보시려면 마커를 클릭해주세요.</div> 
                    : <div className="map-explain">지도를 확대하실 수 있습니다.</div>}
                    </span>
                    <div className="map" ref={container} ></div>
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
                </div>
                {detail && (
                    <div className="map__detail vertical">
                        <h3>{detail.name}</h3>
                        {detail.attachmentUrlArray[0] && (
                            <>
                                <img src={detail.attachmentUrlArray[imgPage]} alt="detail-img" width="100%" height="auto"/>
                                <div className="map-detail__img-btn__container">
                                    {imgPage !== 0 && <button className="map-detail__img-btn prev" onClick={clickPrevImg}>◀</button>}
                                    {imgPage !== detail.attachmentUrlArray.length -1 & detail.attachmentUrlArray.lenth !== 1 && <button className="map-detail__img-btn next" onClick={clickNextImg}>▶</button>}
                                </div>
                            </>
                        )}
                        <div>{detail.description}</div>
                        <Link to={{
                                    pathname: "/detail",
                                    state: {
                                        from: "지도",
                                        place: detail
                                    }
                                }}>
                        더 알아보기
                        </Link>
                        {detail.url !== "" && <a href={detail.url} target="_blank" rel="noreferrer">관련 사이트</a>}
                        {/* <AddMyPlace place={detail}/> */}
                        <div className="map__detail-clear" onClick={onClickClear}>❌</div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Map;