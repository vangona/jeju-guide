import React, { useState } from "react"
import { useHistory } from "react-router"
import { useLocation } from "react-router-dom";

const Detail = () => {
    const location = useLocation();
    const { state : { place } } = location;
    const history = useHistory();
    const [imgPage, setImgPage] = useState(0);

    const clickBackBtn = () => {
        history.push({
            pathname: "/",
            state: {
                prevViewType: "목록"
            }
        })
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

    return (
        <>
            <div>{place.name}</div>
            <img src={place.attachmentUrlArray[imgPage]} style={{maxHeight:"300px"}} alt="detail-img"/>
            <div className="map-detail__img-btn__container">
                {imgPage !== 0 && <button className="map-detail__img-btn prev" onClick={clickPrevImg}>◀</button>}
                {imgPage !== place.attachmentUrlArray.length -1 & place.attachmentUrlArray.lenth !== 1 && <button className="map-detail__img-btn next" onClick={clickNextImg}>▶</button>}
            </div>
            <p>{place.description}</p>
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default Detail;