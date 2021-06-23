import { dbService } from "fBase";
import React, { useEffect, useRef, useState } from "react";

/* global kakao */

const Map = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const container = useRef(null);
    let map = {};
    const options = {
        center: new kakao.maps.LatLng(33.3817, 126.5492), //지도의 중심좌표.
        level: 10 //지도의 레벨(확대, 축소 정도)
    }

    const makeMarker = (place) => {
        const content = (
            `<div class="place-infowindow">${place.name}<hr>
            ${place.attachmentUrl && place.attachmentUrl}
            ${place.description}
            </div>`
            )
        const position = new kakao.maps.LatLng(place.geocode[0], place.geocode[1])
        const marker = new kakao.maps.Marker({
            map: map,
            position
        });

        const infowindow = new kakao.maps.InfoWindow({
            content,
            removeable: true
        })

        const mouseOverHandler = (map, marker, infowindow) => {
            return function () {
                infowindow.open(map, marker);
            }
        };

        const mouseOutHandler = (infowindow) => {
            return function () {
                infowindow.close();
            }
        };

        kakao.maps.event.addListener(marker, 'mouseover', mouseOverHandler(map, marker, infowindow));
        kakao.maps.event.addListener(marker, 'mouseout', mouseOutHandler(infowindow));
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

    useEffect(() => {
        getPlaces();
        if (loading) {
            makeMap();
            places.map(place => {
                makeMarker(place)
            })
        }
    }, [loading]);
    return (
        <>
            {loading ? <div className="map" style={{width:"650px", height:"500px"}} ref={container}></div> : "Loading..."}
        </>
    )
}

export default Map;