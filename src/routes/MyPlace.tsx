import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faHome, 
  faHeart, 
  faMapMarkerAlt,
  faSearchLocation,
  faFilter,
  faSort,
  faMapPin
} from '@fortawesome/free-solid-svg-icons';
import { PlaceInfo } from '../types';
import AddMyPlace from '../components/AddMyPlace';
import Navigation from '../components/Navigation';

const MyPlace = () => {
  const navigate = useNavigate();
  const [myPlaceArray, setMyPlaceArray] = useState<PlaceInfo[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceInfo[]>([]);
  const [filterType, setFilterType] = useState('전체');
  const [sortBy, setSortBy] = useState('최근순');
  const [searchTerm, setSearchTerm] = useState('');

  const clickBackBtn = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  // Navigation handlers
  const handleViewTypeChange = (newViewType: string) => {
    if (newViewType === '지도' || newViewType === '목록') {
      navigate('/');
    }
  };


  useEffect(() => {
    const localMyPlace = localStorage.getItem('micheltain_myplace');
    const parsedMyPlace = localMyPlace ? JSON.parse(localMyPlace) : [];
    setMyPlaceArray(parsedMyPlace);
    setFilteredPlaces(parsedMyPlace);
  }, []);

  // Filter and sort places
  useEffect(() => {
    let filtered = [...myPlaceArray];

    // Apply type filter
    if (filterType !== '전체') {
      filtered = filtered.filter(place => place.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(place => 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === '이름순') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === '타입순') {
      filtered.sort((a, b) => a.type.localeCompare(b.type));
    }
    // 최근순은 현재 배열 순서 유지

    setFilteredPlaces(filtered);
  }, [myPlaceArray, filterType, sortBy, searchTerm]);

  // Get unique place types
  const getUniqueTypes = () => {
    const types = myPlaceArray.map(place => place.type);
    const uniqueTypes: string[] = [];
    types.forEach(type => {
      if (!uniqueTypes.includes(type)) {
        uniqueTypes.push(type);
      }
    });
    return uniqueTypes;
  };

  // Handle place removal
  const handlePlaceUpdate = () => {
    const localMyPlace = localStorage.getItem('micheltain_myplace');
    const parsedMyPlace = localMyPlace ? JSON.parse(localMyPlace) : [];
    setMyPlaceArray(parsedMyPlace);
  };

  // Confirmation dialog for removing places
  const handleRemoveConfirm = async (place: PlaceInfo): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmed = window.confirm(
        `"${place.name}"을(를) 관심 목록에서 제거하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`
      );
      resolve(confirmed);
    });
  };

  if (myPlaceArray.length === 0) {
    return (
      <div className='myplace__container'>
        <header className='myplace__header'>
          <div className='myplace__nav'>
            <button className='nav-btn nav-btn--back' onClick={clickBackBtn}>
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>뒤로</span>
            </button>
            <h1 className='myplace__title'>
              <FontAwesomeIcon icon={faHeart} className='title-icon' />
              나의 장소
            </h1>
            <button className='nav-btn nav-btn--home' onClick={goHome}>
              <FontAwesomeIcon icon={faHome} />
              <span>홈</span>
            </button>
          </div>
        </header>

        <div className='myplace__empty'>
          <div className='empty__content'>
            <FontAwesomeIcon icon={faHeart} className='empty__icon' />
            <h3>저장된 장소가 없습니다</h3>
            <p>마음에 드는 장소를 찾아서 하트 버튼을 눌러보세요!</p>
            <button className='btn-primary' onClick={goHome}>
              장소 둘러보기
            </button>
          </div>
        </div>
        
        <Navigation 
          handleViewTypeChange={handleViewTypeChange}
        />
      </div>
    );
  }

  return (
    <div className='myplace__container'>
      <header className='myplace__header'>
        <div className='myplace__nav'>
          <button className='nav-btn nav-btn--back' onClick={clickBackBtn}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          <h1 className='myplace__title'>
            <FontAwesomeIcon icon={faHeart} className='title-icon' />
            나의 장소 ({myPlaceArray.length})
          </h1>
          <button className='nav-btn nav-btn--home' onClick={goHome}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>

      <div className='myplace__content'>
        <div className='myplace__controls'>
          <div className='search__container'>
            <input
              type='text'
              placeholder='장소 이름, 설명, 주소로 검색...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search__input'
            />
          </div>

          <div className='controls__row'>
            <div className='filter__group'>
              <FontAwesomeIcon icon={faFilter} className='control-icon' />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className='filter__select'
              >
                <option value='전체'>전체 타입</option>
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className='sort__group'>
              <FontAwesomeIcon icon={faSort} className='control-icon' />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='sort__select'
              >
                <option value='최근순'>최근순</option>
                <option value='이름순'>이름순</option>
                <option value='타입순'>타입순</option>
              </select>
            </div>
          </div>
        </div>

        <div className='places__grid'>
          {filteredPlaces.length === 0 ? (
            <div className='no-results'>
              <FontAwesomeIcon icon={faMapPin} className='no-results__icon' />
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            filteredPlaces.map((place, index) => (
              <div key={`${place.name}-${index}`} className='place__card'>
                <div className='card__header'>
                  <div className='place__info'>
                    <h3 className='place__name'>{place.name}</h3>
                    <span className='place__type'>{place.type}</span>
                  </div>
                  <AddMyPlace 
                    place={place} 
                    size='small' 
                    onUpdate={handlePlaceUpdate}
                    onRemoveConfirm={handleRemoveConfirm}
                  />
                </div>

                <div className='card__content'>
                  <p className='place__description'>
                    {place.description.length > 120 
                      ? `${place.description.slice(0, 120)}...` 
                      : place.description
                    }
                  </p>
                  
                  {place.address && (
                    <div className='place__address'>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className='address-icon' />
                      <span>{place.address}</span>
                    </div>
                  )}
                </div>

                <div className='card__actions'>
                  <Link
                    to={`/detail/${place.name}`}
                    className='btn-detail'
                  >
                    <FontAwesomeIcon icon={faSearchLocation} />
                    <span>자세히 보기</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Navigation 
        handleViewTypeChange={handleViewTypeChange}
      />
    </div>
  );
};

export default MyPlace;