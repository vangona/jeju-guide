import List from "components/List";
import Map from "components/Map";
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [places, setPlaces] = useState([]);
    const [viewType, setViewType] = useState("지도");

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
    useEffect(() => {
        getPlaces();
        if (location.state !== undefined) {
            setViewType(location.state.prevViewType)
        } 
    }, [])
    return (
        <div className="home__container">
            <h3 className="home__title">MICHETAIN GUIDE</h3>
            {loading === true & viewType === "지도" 
            ? 
            <>
                <button onClick={onClickMap}>리스트로 보기</button>
                <Map places={places}/>
            </>
            : (loading === true & viewType === "목록"
                ?
                <> 
                    <button onClick={onClickMap}>지도로 보기</button>                
                    <List places={places}/>
                </>
                : "Loading..."
            )
            }
            <Link to="/myplace"><button>내 여행지 목록</button></Link>
        </div>
    )
}

export default Home;