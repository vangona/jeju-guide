import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faTag,
  faEye,
  faListUl,
  faThLarge,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { PlaceInfo } from '../types';
import Pagination from './Pagination';
import AddMyPlace from './AddMyPlace';

interface ListProps {
  places: PlaceInfo[];
  isMobile: boolean;
}

const List = ({ places, isMobile }: ListProps) => {
  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<string>('12');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'table' : 'cards');
  };

  // Enable scrolling for List component
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.classList.add('list__page-active');
    
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.classList.remove('list__page-active');
    };
  }, []);

  const indexOfLast = currentPage * parseInt(postsPerPage);
  const indexOfFirst = indexOfLast - parseInt(postsPerPage);
  const currentPosts = (posts: PlaceInfo[]) => {
    const currentPosts = posts.slice(indexOfFirst, indexOfLast);
    return currentPosts;
  };

  const filteredPlaces = places.filter((place) => {
    const matchesType = place.type === type || type === '전체';
    const matchesSearch = 
      place.name.includes(value) ||
      place.addressDetail.includes(value) ||
      place.description.includes(value);
    return matchesType && matchesSearch;
  });

  const paginatedPlaces = currentPosts(filteredPlaces);

  const renderCards = () => (
    <div className="list__cards-grid">
      {paginatedPlaces.map((place, index) => (
        <div key={place.id || index} className="place__card">
          <div className="place__card-header">
            <h3 className="place__name">
              <Link to={`/detail/${place.name}`} state={{ from: '목록' }}>
                {place.name}
              </Link>
            </h3>
            <span className="place__type">
              <FontAwesomeIcon icon={faTag} />
              {place.type}
            </span>
          </div>
          
          {place.attachmentUrlArray && place.attachmentUrlArray.length > 0 && (
            <div className="place__image">
              <img 
                src={place.attachmentUrlArray[0]} 
                alt={place.name}
                loading="lazy"
              />
            </div>
          )}
          
          <div className="place__content">
            <div className="place__address">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{place.addressDetail}</span>
            </div>
            
            <p className="place__description">
              {place.description.length > 100 
                ? `${place.description.slice(0, 100)}...` 
                : place.description
              }
            </p>
          </div>
          
          <div className="place__actions">
            <Link 
              to={`/detail/${place.name}`} 
              state={{ from: '목록' }}
              className="place__detail-btn"
            >
              <FontAwesomeIcon icon={faEye} />
              자세히 보기
            </Link>
            <AddMyPlace place={place} size="medium" showLabel={false} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="list__table-container">
      <table className='list__table'>
        <thead>
          <tr>
            <th>이름</th>
            <th>주소</th>
            {!isMobile && <th>설명</th>}
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPlaces.map((place, index) => (
            <tr key={place.id || index}>
              <td className='list__table-name list__table-content'>
                <Link
                  to={`/detail/${place.name}`}
                  state={{ from: '목록' }}
                >
                  {place.name}
                </Link>
                <span className="table__type">
                  <FontAwesomeIcon icon={faTag} />
                  {place.type}
                </span>
              </td>
              <td className="list__table-content">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {place.addressDetail}
              </td>
              {!isMobile && (
                <td className="list__table-content">
                  {place.description.length > 50 
                    ? `${place.description.slice(0, 50)}...` 
                    : place.description
                  }
                </td>
              )}
              <td className="list__add-place-cell">
                <AddMyPlace place={place} size="small" showLabel={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className='list__container'>
      {/* Header */}
      <div className="list__header">
        <div className="list__title">
          <FontAwesomeIcon icon={faListUl} />
          <h2>장소 목록</h2>
          <span className="list__count">{filteredPlaces.length}개 장소</span>
        </div>
        
        {/* Controls */}
        <div className="list__controls">
          <div className="list__search">
            <div className="search__input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search__icon" />
              <input
                className='search__input'
                type='text'
                onChange={onChange}
                value={value}
                placeholder='장소명, 주소, 설명 검색...'
              />
            </div>
          </div>
          
          <div className="list__filters">
            <div className="filter__group">
              <FontAwesomeIcon icon={faFilter} />
              <select
                className='filter__select'
                name='input__place-type'
                onChange={onTypeChange}
                value={type}
              >
                <option value='전체'>전체</option>
                <option value='맛집'>맛집</option>
                <option value='카페 & 베이커리'>카페 & 베이커리</option>
                <option value='풍경'>풍경</option>
                <option value='술집'>술집</option>
                <option value='숙소'>숙소</option>
                <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
              </select>
            </div>
            
            {!isMobile && (
              <div className="filter__group">
                <FontAwesomeIcon icon={faSort} />
                <select
                  className='filter__select'
                  onChange={onPostsPerPageChange}
                  value={postsPerPage}
                >
                  <option value='6'>6개씩</option>
                  <option value='12'>12개씩</option>
                  <option value='24'>24개씩</option>
                </select>
              </div>
            )}
            
            <button 
              className="view__toggle"
              onClick={toggleViewMode}
              title={viewMode === 'cards' ? '테이블 보기' : '카드 보기'}
            >
              <FontAwesomeIcon icon={viewMode === 'cards' ? faListUl : faThLarge} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="list__content">
        {filteredPlaces.length === 0 ? (
          <div className="list__empty">
            <FontAwesomeIcon icon={faSearch} />
            <h3>검색 결과가 없습니다</h3>
            <p>다른 검색어나 필터를 시도해보세요.</p>
          </div>
        ) : (
          <>
            {viewMode === 'cards' ? renderCards() : renderTable()}
            
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={filteredPlaces.length}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default List;
