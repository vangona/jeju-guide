import React from "react";
import { useHistory } from "react-router-dom";

const List = ({places}) => {
    const history = useHistory();
    const clickTable = (event) => {
        const name = event.target.innerText
        history.push({
            pathname: "/detail",
            state: {
                name
            }
        })
    }
    return (
        <table className="map-list__table">
        <thead>
            <tr>
                <th>번호</th>
                <th>이름</th>
                <th>주소</th>
                <th>설명</th>
            </tr>
        </thead>
        {places.map((place, index) => {
            return (
                <tbody key={index}>
                    <tr>
                        <td>{index + 1}</td>
                        <td onClick={clickTable}>{place.name}</td>
                        <td>{place.addressDetail}</td>
                        <td>{place.description}</td>
                    </tr>
                </tbody>
            )
        })}
    </table>
    )
}

export default List;