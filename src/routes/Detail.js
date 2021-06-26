import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"

const Detail = () => {
    const history = useHistory();
    const [state, setState] = useState({});
    const clickBackBtn = () => {
        history.goBack();
    }
    useEffect(()=>{
        const {location : {state}} = history;
        setState(state);
    }, [])
    return (
        <>
            <div>Detail</div>
            <div>{state.name}</div>
            <button onClick={clickBackBtn}>Back</button>
        </>
    )
}

export default Detail;