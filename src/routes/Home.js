import List from "components/List";
import Map from "components/Map";
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [places, setPlaces] = useState([]);
    const [viewType, setViewType] = useState("지도");
    const onViewTypeChange = (event) => {
        const {target : {value}} = event;
        setViewType(value);
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
    })
    return (
        <div className="home__container">
            <h3 className="home__title">MICHETAIN GUIDE</h3>
            <div>
                <input type="radio" name="input__view-type" value="지도" defaultChecked onChange={onViewTypeChange}/><label htmlFor="지도">지도</label>
                <input type="radio" name="input__view-type" value="목록" onChange={onViewTypeChange}/><label htmlFor="목록">목록</label>
            </div>
            {loading === true & viewType === "지도" 
            ? <Map places={places}/>
            : (loading === true & viewType === "목록"
                ? <List places={places}/>
                : "Loading..."
            )
            }
        </div>
    )
}

export default Home;