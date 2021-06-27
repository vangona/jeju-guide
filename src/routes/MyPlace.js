import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const MyPlace = () => {
    const history = useHistory();
    const [myPlaceArray, setMyPlaceArray] = useState([]);
    const clickBackBtn = () => {
        history.push({
            pathname: "/",
            state: {
                prevViewType: "목록"
            }
        })
    }

    useEffect(() => {
        const localMyPlace = JSON.parse(localStorage.getItem("micheltain_myplace"))
        setMyPlaceArray(localMyPlace)
    }, [])
    return (
        <>
            <div>myplace</div>
            {myPlaceArray !== null && <div>{myPlaceArray.name}</div>}
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default MyPlace;