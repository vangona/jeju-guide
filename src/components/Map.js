import { dbService } from "fBase";
import React, { useEffect, useRef, useState } from "react";

/* global kakao */

const Map = () => {
    const [places, setPlaces] = useState([]);
    const [map, getMap] = useState({});
    const container = useRef(null);
    const options = {
        center: new kakao.maps.LatLng(33.3817, 126.5492), //지도의 중심좌표.
        level: 10 //지도의 레벨(확대, 축소 정도)
    }

    const getPlaces = async () => {
        await dbService.collection("places").onSnapshot(snapshot => {
            const placeArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            setPlaces(placeArray);
        })
    }

    const makeMarker = (place) => {
        const position = new kakao.maps.LatLng(place.geocode[0], place.geocode[1])
        const content = '<div style="padding:5px;">Hello</div>'
        const isRemoveable = true;
        const infowindow = new kakao.maps.InfoWindow({
            map: map,
            position,
            content,
            removeable: isRemoveable,
        })
        console.log(position, content)
    }

    useEffect(() => {
        getMap(new window.kakao.maps.Map(container.current, options));
        getPlaces();
        console.log(places)
        places.map(place => {
            makeMarker(place)
        })
    }, [])
    return (
        <div className="map" style={{width:"650px", height:"500px"}} ref={container}></div>
    )
}

export default Map;