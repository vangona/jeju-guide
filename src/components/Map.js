import { dbService } from "fBase";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* global kakao */

const Map = ({places, myPlaces}) => {
    const [type, setType] = useState("전체");
    const [detail, setDetail] = useState(null);
    const [imgPage, setImgPage] = useState(0);
    const [mouseState, setMouseState] = useState(false);
    const [myPlace, setMyPlace] = useState([]);
    const container = useRef(null);
    let map = {};
    const options = {
        center: new kakao.maps.LatLng(33.3817, 126.5602), //지도의 중심좌표.
        level: 10 //지도의 레벨(확대, 축소 정도)
    }

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
        const content = `<div class="place__infowindow">${place.name}</div>`
        const position = new kakao.maps.LatLng(place.geocode[0], place.geocode[1])
        const overlay = new kakao.maps.CustomOverlay({
            content,
            position,
            yAnchor: 2,
        })
        const marker = new kakao.maps.Marker({
            map: map,
            position
        });

        kakao.maps.event.addListener(marker, 'click', clickHandler(place));
        kakao.maps.event.addListener(marker, 'mouseover', mouseOverHandler(map, overlay));
        kakao.maps.event.addListener(marker, 'mouseout', mouseOutHandler(overlay));
    }

    const makeMap = () => {
        map = new window.kakao.maps.Map(container.current, options);
    }

    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }

    const onClickClear = () => {
        setDetail(null);
    }

    useEffect(() => {
        makeMap();
        places.map(place => {
            if(type === "전체" || place.type === type) {
                makeMarker(place)
            }
        })
    }, []);
    return (
        <>
            <div className="map__container">
                <div className="vertical">
                    <div className="map" ref={container} ></div>
                    <div className="map-radio__container">
                            <input type="radio" name="input__place-type" value="전체" defaultChecked onChange={onTypeChange}/><label htmlFor="전체">전체</label>
                            <input type="radio" name="input__place-type" value="맛집" onChange={onTypeChange}/><label htmlFor="맛집">맛집</label>
                            <input type="radio" name="input__place-type" value="카페 & 베이커리" onChange={onTypeChange}/><label htmlFor="카페 & 베이커리">카페 & 베이커리</label>
                            <input type="radio" name="input__place-type" value="풍경" onChange={onTypeChange}/><label htmlFor="풍경">풍경</label>
                            <input type="radio" name="input__place-type" value="술집" onChange={onTypeChange}/><label htmlFor="술집">술집</label>
                            <input type="radio" name="input__place-type" value="그 외 가볼만한 곳" onChange={onTypeChange}/><label htmlFor="그 외 가볼만한 곳">그 외 가볼만한 곳</label>
                    </div>
                    {mouseState && <span>더 알아보시려면 마커를 클릭해주세요.</span>}
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
                        {detail.url !== "" && <a href={detail.url} target="_blank" rel="noreferrer">관련 사이트</a>}
                        <div className="map__detail-clear" onClick={onClickClear}>❌</div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Map;