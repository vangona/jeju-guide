import AddMyPlace from "components/AddMyPlace";
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { useLocation } from "react-router-dom";
import ScriptTag from "react-script-tag"

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
                <ins
                className="kakao_ad_area"
                style={{display:"none"}}
                data-ad-unit="DAN-c9rNVYJ0iiSwi4Sm"
                data-ad-width="320"
                data-ad-height="50"
                ></ins>
                <button style={{marginTop:"1rem"}} onClick={clickBackBtn}>돌아가기</button>
            </div>
            <ScriptTag type="text/javascript"
                    src="//t1.daumcdn.net/kas/static/ba.min.js" 
                    async >
            </ScriptTag>
        </div>
    )
}

export default Detail;