import React from "react";
import { Link } from "react-router-dom";

const List = ({places, myPlaces}) => {
    return (
        <>
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
                            <td>
                                <Link to={{
                                    pathname: "/detail",
                                    state: {
                                        place
                                    }
                                }}>
                                {place.name}
                                </Link>
                            </td>
                            <td>{place.addressDetail}</td>
                            <td>{place.description}</td>
                        </tr>
                    </tbody>
                )
            })}
            </table>
        </>
    )
}

export default List;