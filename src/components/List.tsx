import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaceInfo } from '../types';
import Pagination from './Pagination';

interface ListProps {
  places: PlaceInfo[];
  isMobile: boolean;
}

const List = ({ places, isMobile }: ListProps) => {
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<string>('5');

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };

  const onTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const {
      target: { value },
    } = event;
    setType(value);
  };

  const onPostsPerPageChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event,
  ) => {
    const {
      target: { value },
    } = event;
    setPostsPerPage(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const indexOfLast = currentPage * parseInt(postsPerPage);
  const indexOfFirst = indexOfLast - parseInt(postsPerPage);
  const currentPosts = (posts: PlaceInfo[]) => {
    const currentPosts = posts.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  };

  return (
    <div className='list__container'>
      <div className='list__title'>
        자세히 알고싶다면 장소명을 클릭해주세요.
      </div>
      <table className='list__table'>
        <thead>
          <tr>
            <th>이름</th>
            <th>주소</th>
            {!isMobile && <th>설명</th>}
            {/* <th>추가</th> */}
          </tr>
        </thead>
        {currentPosts(places)
          .filter((place) => {
            return place.type === type || type === '전체';
          })
          .map((place, index) => {
            return (
              <tbody key={index}>
                {place.name.includes(value) ||
                place.addressDetail.includes(value) ||
                place.description.includes(value) ? (
                  <tr style={{ backgroundColor: 'white' }}>
                    <td className='list__table-name list__table-content'>
                      <Link
                        to={`/detail/${place.name}`}
                        state={{ from: '목록' }}
                      >
                        {place.name}
                      </Link>
                    </td>
                    <td className="list__table-content">{place.addressDetail}</td>
                    {!isMobile && <td>{place.description}</td>}
                    {/* <td><AddMyPlace place={place}/></td> */}
                  </tr>
                ) : null}
              </tbody>
            );
          })}
      </table>
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={places.length}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
      <div className='list-search__container'>
        {!isMobile && (
          <select
            className='list-saerch__pnum'
            onChange={onPostsPerPageChange}
            defaultValue='10'
          >
            <option value='5'>5개씩 보기</option>
            <option value='10'>10개씩 보기</option>
            <option value='15'>15개씩 보기</option>
          </select>
        )}
        <select
          className='place-type__list'
          name='input__place-type'
          onChange={onTypeChange}
        >
          <option value='전체'>전체</option>
          <option value='맛집'>맛집</option>
          <option value='카페 & 베이커리'>카페 & 베이커리</option>\
          <option value='풍경'>풍경</option>
          <option value='술집'>술집</option>
          <option value='숙소'>숙소</option>
          <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
        </select>
        <input
          className='list-search__input'
          type='text'
          onChange={onChange}
          value={value}
          placeholder='장소명, 주소, 설명...'
        />
      </div>
    </div>
  );
};

export default List;
