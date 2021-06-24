import { dbService } from "fBase";
import React, { useEffect, useRef, useState } from "react";

/* global kakao */

const Map = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("전체");
    const [detail, setDetail] = useState(null);
    const container = useRef(null);
    let map = {};
    const options = {
        center: new kakao.maps.LatLng(33.3817, 126.5602), //지도의 중심좌표.
        level: 10 //지도의 레벨(확대, 축소 정도)
    }

    const clickHandler = (place) => {
        return function () {
            setDetail(place)
        }
    }

    const mouseOverHandler = (map, overlay) => {
        return function () {
            overlay.setMap(map);
        }
    };

    const mouseOutHandler = (overlay) => {
        return function () {
            overlay.setMap(null)
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

    const getPlaces = async () => {
        await dbService.collection("places").onSnapshot(snapshot => {
            const placeArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            setPlaces(placeArray);
            setLoading(true);
        })
    }

    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }

    const onClickClear = () => {
        setDetail(null);
    }

    useEffect(() => {
        getPlaces();
        if (loading) {
            makeMap();
            places.map(place => {
                if(type === "전체" || place.type === type) {
                    makeMarker(place)
                }
            })
        }
    }, [loading, type]);
    return (
        <>
            {loading 
            ? (
            <div className="map__container">
                <div className="vertical">
                    <div className="map" ref={container} ></div>
                    <div className="map-radio__container">
                            <input type="radio" name="input__place-type" value="전체" defaultChecked onChange={onTypeChange}/><label htmlFor="전체">전체</label>
                            <input type="radio" name="input__place-type" value="맛집" onChange={onTypeChange}/><label htmlFor="전체">맛집</label>
                            <input type="radio" name="input__place-type" value="카페 & 베이커리" onChange={onTypeChange}/><label htmlFor="전체">카페 & 베이커리</label>
                            <input type="radio" name="input__place-type" value="풍경" onChange={onTypeChange}/><label htmlFor="전체">풍경</label>
                            <input type="radio" name="input__place-type" value="그 외 가볼만한 곳" onChange={onTypeChange}/><label htmlFor="전체">그 외 가볼만한 곳</label>
                    </div>
                </div>
                {detail && (
                    <div className="map__detail vertical">
                        <h3>{detail.name}</h3>
                        <div>{detail.description}</div>
                        <div className="map__detail-clear" onClick={onClickClear}>❌</div>
                    </div>
                )}
            </div>
            ) : "Loading..."}
        </>
    )
}

export default Map;