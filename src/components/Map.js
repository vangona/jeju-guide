import React, { useEffect, useRef } from "react";

/* global kakao */

const Map = () => {
    const container = useRef(null);
    const options = {
        center: new kakao.maps.LatLng(33.3817, 126.5492), //지도의 중심좌표.
        level: 10 //지도의 레벨(확대, 축소 정도)
    }

    useEffect(() => {
        const map = new window.kakao.maps.Map(container.current, options);
        return () => {};
    }, [])
    return (
        <div className="map" style={{width:"650px", height:"500px"}} ref={container}></div>
    )
}

export default Map;