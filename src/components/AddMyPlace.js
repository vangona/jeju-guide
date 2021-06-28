import React from "react";

const AddMyPlace = ({place}) => {

    const onClickAddBtn = () => {
        const localArray = JSON.parse(localStorage.getItem("micheltain_myplace"))
        if (localArray === null) {
            localStorage.setItem("micheltain_myplace", JSON.stringify([place]))
        } else {
            if (localArray.some(localplace => localplace.name === place.name)) {
                alert("이미 추가된 항목입니다.")
            } else {
                localStorage.setItem("micheltain_myplace", JSON.stringify([...localArray, place]))
            }
        }
    }

    return (
        <button onClick={onClickAddBtn}>+</button>
    )
}

export default AddMyPlace;