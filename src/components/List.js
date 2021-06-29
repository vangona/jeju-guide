import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddMyPlace from "./AddMyPlace";

const List = ({places, localArray, isMobile}) => {
    const [value, setValue] = useState("");
    const [type, setType] = useState("전체");
    const onChange = (event) => {
        const {target : {value} } = event;
        setValue(value);
    }
    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }
    return (
        <div className="list__container">
            <h5 className="list__title">자세히 알고싶다면 장소명을 클릭해주세요.</h5>
            <table className="list__table">
            <thead>
                <tr>
                    <th>이름</th>
                    <th>주소</th>
                    {!isMobile && <th>설명</th>}
                    {/* <th>추가</th> */}
                </tr>
            </thead>
            {places.filter(place=>{return (place.type === type | type === "전체")}).map((place, index) => {
                return (
                    <tbody key={index}>
                        {place.name.includes(value) | place.addressDetail.includes(value) | place.description.includes(value)
                        ? (<tr style={localArray === null 
                                ? (
                                    {backgroundColor:"white"}
                                ) : (
                                    localArray.some(localPlace => localPlace.name === place.name)
                                    ? {backgroundColor:"wheat"}
                                    : {backgroundColor:"white"}
                                )}>
                                <td className="list__table-name">
                                    <Link to={{
                                        pathname: "/detail",
                                        state: {
                                            from: "목록",
                                            place
                                        }
                                    }}>
                                    {place.name}
                                    </Link>
                                </td>
                                <td>{place.addressDetail}</td>
                                {!isMobile && <td>{place.description}</td>}
                                {/* <td><AddMyPlace place={place}/></td> */}
                            </tr>
                        ) : (null)
                        }
                    </tbody>
                )
            })}
            </table>
            <div className="list-search__container">
                {isMobile
                        ? (
                            <select className="place-type__list" name="input__place-type" onChange={onTypeChange} >
                                <option value="전체">전체</option>
                                <option value="맛집">맛집</option>
                                <option value="카페 & 베이커리">카페 & 베이커리</option>\
                                <option value="풍경">풍경</option>
                                <option value="술집">술집</option>
                                <option value="그 외 가볼만한 곳">그 외 가볼만한 곳</option>
                            </select>
                        ) : (
                        <div className="list-radio__container">
                                <input type="radio" name="input__place-type" value="전체" defaultChecked onChange={onTypeChange}/><label htmlFor="전체">전체</label>
                                <input type="radio" name="input__place-type" value="맛집" onChange={onTypeChange}/><label htmlFor="맛집">맛집</label>
                                <input type="radio" name="input__place-type" value="카페 & 베이커리" onChange={onTypeChange}/><label htmlFor="카페 & 베이커리">카페 & 베이커리</label>
                                <input type="radio" name="input__place-type" value="풍경" onChange={onTypeChange}/><label htmlFor="풍경">풍경</label>
                                <input type="radio" name="input__place-type" value="술집" onChange={onTypeChange}/><label htmlFor="술집">술집</label>
                                <input type="radio" name="input__place-type" value="그 외 가볼만한 곳" onChange={onTypeChange}/><label htmlFor="그 외 가볼만한 곳">그 외 가볼만한 곳</label>
                        </div>
                        )}
                <input type="text" onChange={onChange} value={value} placeholder="장소명, 주소, 설명..."/>
            </div>
        </div>
    )
}

export default List;