import React from "react"
import { useHistory } from "react-router"

const Detail = () => {
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
            <div>Detail</div>
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default Detail;