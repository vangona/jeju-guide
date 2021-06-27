import React from "react";
import { useHistory } from "react-router-dom";

const MyPlace = () => {
    const history = useHistory();
    const clickBackBtn = () => {
        history.push({
            pathname: "/",
            state: {
                prevViewType: "목록"
            }
        })
    }
    return (
        <>
            <div>myplace</div>
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default MyPlace;