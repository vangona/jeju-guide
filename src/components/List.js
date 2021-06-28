import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AddMyPlace from "./AddMyPlace";

const List = ({places, localArray}) => {
    return (
        <>
            <table className="map-list__table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>이름</th>
                    <th>주소</th>
                    <th>설명</th>
                    <th>추가</th>
                </tr>
            </thead>
            {places.map((place, index) => {
                return (
                    <tbody key={index}>
                        
                        <tr style={localArray === null 
                            ? (
                                {backgroundColor:"white"}
                            ) : (
                                localArray.some(localPlace => localPlace.name === place.name)
                                ? {backgroundColor:"wheat"}
                                : {backgroundColor:"white"}
                            )}>
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
                            <td><AddMyPlace place={place}/></td>
                        </tr>
                    </tbody>
                )
            })}
            </table>
        </>
    )
}

export default List;