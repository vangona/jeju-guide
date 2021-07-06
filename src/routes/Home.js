import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import List from "components/List";
import Map from "components/Map";
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const Home = ({ isMobile }) => {
    const location = useLocation();
    const [detail, setDetail] = useState(null);
    const [imgPage, setImgPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [places, setPlaces] = useState([]);
    const [viewType, setViewType] = useState("지도");
    const localArray = JSON.parse(localStorage.getItem("micheltain_myplace"))

    
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
    const onClickMap = () => {
        if (viewType === "목록") {
            setViewType("지도")
        } else if (viewType === "지도") {
            setViewType("목록")
        }
    }

    const onClickClear = () => {
        setDetail(null);
    }

    const getGA = () => {
        console.log('홈 진입')
        const pathName = window.location.pathname;
        ReactGA.initialize('UA-199674845-1');
        ReactGA.set({ page:pathName });
        ReactGA.pageview(pathName);
    };

    useEffect(() => {
        getPlaces();
        getGA();
        if (location.state !== undefined) {
            setViewType(location.state.prevViewType)
        } 
    }, [])
    return (
        <div className="home__container">
            <div className="vertical">
                <h3 className="home__title">MICHETAIN GUIDE</h3>
                <button className="home-viewtype" onClick={onClickMap}><FontAwesomeIcon icon={faExchangeAlt} /> {viewType === "지도" ? "리스트로 보기" : "지도로 보기"}</button>   
                {loading === true & viewType === "지도" 
                ? <Map places={places} localArray={localArray} isMobile={isMobile} setDetail={setDetail}/>
                : (loading === true & viewType === "목록"
                    ? <List places={places} localArray={localArray} isMobile={isMobile}/>
                    : "Loading..."
                )
                }
            </div>
            {detail && (
                <div className="map-detail__container"> 
                    <div className="map__detail vertical">
                        <h3>{detail.name}</h3>
                        {detail.attachmentUrlArray[0] && (
                            <>
                                <img className="map-detail__img" src={detail.attachmentUrlArray[0]} alt="detail-img" width="100%" height="auto"/>
                                {/* <div className="map-detail__img-btn__container">
                                    {imgPage !== 0 && <button className="map-detail__img-btn prev" onClick={clickPrevImg}>◀</button>}
                                    {imgPage !== detail.attachmentUrlArray.length -1 & detail.attachmentUrlArray.lenth !== 1 ? <button className="map-detail__img-btn next" onClick={clickNextImg}>▶</button> : null}
                                </div> */}
                            </>
                        )}
                        <Link to={{
                                    pathname: "/detail",
                                    state: {
                                        from: "지도",
                                        place: detail
                                    }
                                }}>
                        <div className="map-detail__description">{detail.description.length > 100 ? detail.description.slice(0, 100) + "..." : detail.description}</div>
                        </Link>
                        <div>
                        {detail.url !== "" && <a href={detail.url} target="_blank" rel="noreferrer"><button className="map-detail__url map-detail__btn">관련 사이트</button></a>}
                        <Link to={{
                                    pathname: `/detail/${detail.name}`,
                                    state: {
                                        from: "지도"
                                    }
                                }}>
                        <button onClick={onClickClear} className="map-detail__detail map-detail__btn">더 알아보기</button>
                        </Link>
                        </div>
                        {/* <AddMyPlace place={detail}/> */}
                        <div className="map__detail-clear" onClick={onClickClear}>❌</div>
                    </div>
                </div>
            )}
            {/* <Link to="/myplace"><button>내 여행지 목록</button></Link> */}
        </div>
    )
}

export default Home;