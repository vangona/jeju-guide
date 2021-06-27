import React, { useEffect, useState } from "react";

const AddMyPlace = ({place}) => {
    const [myPlaceArray, setMyPlaceArray] = useState([]);

    const onClickAddBtn = () => {
    }

    useEffect(() => {
        const localMyPlace = JSON.parse(localStorage.getItem("micheltain_myplace"))
        setMyPlaceArray(localMyPlace)
    }, [])

    return (
        <button onClick={onClickAddBtn}>+</button>
    )
}

export default AddMyPlace;