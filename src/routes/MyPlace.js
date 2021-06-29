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
            {myPlaceArray && 
                <>
                    {myPlaceArray.map((myPlace)=>{
                        return(
                            <>
                                <div>{myPlace.name}</div>
                                <div>{myPlace.description}</div>
                            </>
                        )})
                    }
                </>
            }
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default MyPlace;