import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddMyPlace from "./AddMyPlace";
import Pagination from "./Pagination";

const List = ({places, localArray, isMobile}) => {
    const [value, setValue] = useState("");
    const [type, setType] = useState("전체");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const onChange = (event) => {
        const {target : {value} } = event;
        setValue(value);
    }
    const onTypeChange = (event) => {
        const {target : { value } } = event;
        setType(value)
    }
    const onPostsPerPage = (event) => {
        const {target : { value }} = event;
        setPostsPerPage(value);
    }

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    }

    return (
        <div className="list__container">
            <div className="list__title">자세히 알고싶다면 장소명을 클릭해주세요.</div>
            <table className="list__table">
            <thead>
                <tr>
                    <th>이름</th>
                    <th>주소</th>
                    {!isMobile && <th>설명</th>}
                    {/* <th>추가</th> */}
                </tr>
            </thead>
            {currentPosts(places).filter(place=>{return (place.type === type | type === "전체")}).map((place, index) => {
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
                                <td className="list__table-name list__table-content">
                                    <Link to={{
                                        pathname: `/detail/${place.name}`,
                                        state: {
                                            from: "목록"
                                        }
                                    }}>
                                    {place.name}
                                    </Link>
                                </td>
                                <td list__table-content>{place.addressDetail}</td>
                                {!isMobile && <td>{place.description}</td>}
                                {/* <td><AddMyPlace place={place}/></td> */}
                            </tr>
                        ) : (null)
                        }
                    </tbody>
                )
            })}
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={places.length} currentPage={currentPage} paginate={setCurrentPage} />
            <div className="list-search__container">
                {!isMobile && <select className="list-saerch__pnum" onChange={onPostsPerPage} defaultValue="10">
                    <option value="5">5개씩 보기</option>
                    <option value="10">10개씩 보기</option>
                    <option value="15">15개씩 보기</option>
                </select>}
                <select className="place-type__list" name="input__place-type" onChange={onTypeChange} >
                        <option value="전체">전체</option>
                        <option value="맛집">맛집</option>
                        <option value="카페 & 베이커리">카페 & 베이커리</option>\
                        <option value="풍경">풍경</option>
                        <option value="술집">술집</option>
                        <option value="숙소">숙소</option>
                        <option value="그 외 가볼만한 곳">그 외 가볼만한 곳</option>
                </select>
                <input className="list-search__input" type="text" onChange={onChange} value={value} placeholder="장소명, 주소, 설명..."/>
            </div>
        </div>
    )
}

export default List;