import AddMyPlace from "components/AddMyPlace";
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { useLocation } from "react-router-dom";

const Detail = () => {
    const location = useLocation();
    const { state : { place } } = location;
    const { state: { from } } = location;
    const history = useHistory();
    const [imgPage, setImgPage] = useState(0);

    const clickBackBtn = () => {
        history.push({
            pathname: "/",
            state: {
                prevViewType: from
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
        <div className="detail__container">
            <div className="detail-box">
                <div className="detail__name">{place.name}</div>
                <div className="detail-img__container">
                    <img className="detail__img" src={place.attachmentUrlArray[imgPage]} style={{maxWidth:"100%"}} alt="detail-img"/>
                    <div className="detail-img-btn__container">
                        {imgPage !== 0 && <button className="detail__prev detail-btn" onClick={clickPrevImg}>◀</button>}
                        {imgPage !== place.attachmentUrlArray.length -1 & place.attachmentUrlArray.lenth !== 1 ? <button className="detail__next detail-btn" onClick={clickNextImg}>▶</button> : null}
                    </div>
                </div>
                <p className="detail__description">{place.description}</p>
                {/* <AddMyPlace place={place}/> */}
                <button onClick={clickBackBtn}>Back</button>
            </div>
        </div>
    )
}

export default Detail;