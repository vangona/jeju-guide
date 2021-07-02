import { faGithub, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { useHistory } from "react-router"
import ScriptTag from "react-script-tag"

const Tips = () => {
    const history = useHistory();

    const clickBackBtn = () => {
        history.goBack();
    }
    return (
        <div className="detail__container">
            <div className="detail-box tips-box" style={{maxHeight:"90vh"}}>
                <h5>장기여행자 들려주는 꿀팁들</h5>
                <ul className="tips__list">
                    <li>꿀팁 1. 제주도에는 실시간 버스 정보 시스템이 별도로 존재한다.</li>
                    <li>꿀팁 2. 짐 옮기기 서비스를 적극 이용하자.</li>
                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>
                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>
                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>
                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>
                    <li>꿀팁 3. 제주도에서 걷고 싶다면 올레길을 적극 이용하자.</li>
                </ul>
                <div className="maker-int">
                    <h5 style={{textAlign:"center"}}>만든이 소개</h5>
                    <h6 style={{fontSize:"0.8rem"}}>1. 장기여행자</h6>
                    <p style={{fontSize:"0.8rem"}}>
                        제주도를 7개월간 여행하였고 뚜벅초와 개발을 맡고있다.
                    </p>
                    <span className="maker-icons">
                        <a href="https://www.instagram.com/van_gona_/" target="_blank"><FontAwesomeIcon icon={faInstagram} size="2x" color="white"/></a>
                        <a href="https://github.com/vangona/" target="_blank"><FontAwesomeIcon icon={faGithub} size="2x" color="white"/></a>
                    </span>
                    <h6 style={{fontSize:"0.8rem"}}>2. 제주살이꾼</h6>
                    <p style={{fontSize:"0.8rem"}}>
                         제주도에 3년간 살고 있다. SUPER DRIVER이며 SUPER 제주도 GUIDE를 맡고있다.
                    </p>
                    <span className="maker-icons">
                    <a href="https://www.instagram.com/van_gona_/" target="_blank"><FontAwesomeIcon icon={faInstagram} size="2x" color="white"/></a>
                    </span>
                </div>
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

export default Tips;