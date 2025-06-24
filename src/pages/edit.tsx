import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faSearch,
  faEdit,
  faTrash,
  faMapMarkerAlt,
  faFilter,
  faSpinner,
  faSave,
  faTimes,
  faImage,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { dbService, authService } from '../fBase';
import { PlaceInfo } from '../types';

const Edit = () => {
  const router = useRouter();
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlace, setEditingPlace] = useState<PlaceInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  // 수정 폼 상태
  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    description: '',
    address: '',
    url: '',
    attachmentUrlArray: ['']
  });

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const currentUser = authService.currentUser;
      
      if (!currentUser) {
        router.push('/auth');
        return;
      }

      // 현재 사용자가 작성한 장소들만 가져오기
      const q = query(
        collection(dbService, 'places')
      );
      
      const querySnapshot = await getDocs(q);
      const placesData: PlaceInfo[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        placesData.push({
          id: doc.id,
          ...data
        } as PlaceInfo);
      });

      setPlaces(placesData);
    } catch (error) {
      // console.error('장소 불러오기 실패:', error);
      setError('장소 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    // 검색어와 필터 적용
    let filtered = places;

    if (searchTerm) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== '전체') {
      filtered = filtered.filter(place => place.type === filterType);
    }

    setFilteredPlaces(filtered);
  }, [places, searchTerm, filterType]);

  const handleEdit = (place: PlaceInfo) => {
    setEditingPlace(place);
    setEditForm({
      name: place.name,
      type: place.type,
      description: place.description,
      address: place.address || '',
      url: place.url || '',
      attachmentUrlArray: place.attachmentUrlArray || ['']
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      attachmentUrlArray: prev.attachmentUrlArray.map((url, i) => 
        i === index ? value : url
      )
    }));
  };

  const addImageUrl = () => {
    setEditForm(prev => ({
      ...prev,
      attachmentUrlArray: [...prev.attachmentUrlArray, '']
    }));
  };

  const removeImageUrl = (index: number) => {
    if (editForm.attachmentUrlArray.length > 1) {
      setEditForm(prev => ({
        ...prev,
        attachmentUrlArray: prev.attachmentUrlArray.filter((_, i) => i !== index)
      }));
    }
  };

  const handleUpdate = async () => {
    if (!editingPlace) return;

    try {
      setUpdateLoading(true);
      
      const updatedData = {
        ...editForm,
        attachmentUrlArray: editForm.attachmentUrlArray.filter(url => url.trim() !== ''),
        updatedAt: Date.now()
      };

      await updateDoc(doc(dbService, 'places', editingPlace.id!), updatedData);
      
      // 로컬 상태 업데이트
      setPlaces(prev => prev.map(place => 
        place.id === editingPlace.id 
          ? { ...place, ...updatedData }
          : place
      ));

      setEditingPlace(null);
      setError('');
    } catch (error) {
      // console.error('업데이트 실패:', error);
      setError('정보 업데이트에 실패했습니다.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (place: PlaceInfo) => {
    if (!window.confirm(`"${place.name}"을(를) 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteDoc(doc(dbService, 'places', place.id!));
      setPlaces(prev => prev.filter(p => p.id !== place.id));
    } catch (error) {
      // console.error('삭제 실패:', error);
      setError('장소 삭제에 실패했습니다.');
    }
  };

  const getUniqueTypes = () => {
    const types = places.map(place => place.type);
    const uniqueTypes: string[] = [];
    types.forEach(type => {
      if (!uniqueTypes.includes(type)) {
        uniqueTypes.push(type);
      }
    });
    return uniqueTypes;
  };

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className='edit__page'>
        <div className='edit__loading'>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>장소 정보를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='edit__page'>
      <header className='edit__header'>
        <div className='edit__nav'>
          <button className='nav-btn nav-btn--back' onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          <h1 className='edit__title'>장소 관리</h1>
          <button className='nav-btn nav-btn--home' onClick={goHome}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>

      <div className='edit__content'>
        {error && (
          <div className='edit__error'>
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        {/* 검색 및 필터 */}
        <div className='edit__controls'>
          <div className='search__container'>
            <FontAwesomeIcon icon={faSearch} className='search__icon' />
            <input
              type='text'
              placeholder='장소 이름, 설명, 주소로 검색...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='search__input'
            />
          </div>

          <div className='filter__container'>
            <FontAwesomeIcon icon={faFilter} className='filter__icon' />
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
        </div>

        {/* 장소 목록 */}
        <div className='edit__places'>
          {filteredPlaces.length === 0 ? (
            <div className='edit__empty'>
              <FontAwesomeIcon icon={faMapMarkerAlt} className='empty__icon' />
              <h3>등록된 장소가 없습니다</h3>
              <p>새로운 장소를 등록해보세요!</p>
              <button 
                className='btn-primary'
                onClick={() => router.push('/post')}
              >
                장소 등록하기
              </button>
            </div>
          ) : (
            filteredPlaces.map((place) => (
              <div key={place.id} className='place__card'>
                <div className='place__info'>
                  <div className='place__header'>
                    <h3 className='place__name'>{place.name}</h3>
                    <span className='place__type'>{place.type}</span>
                  </div>
                  <p className='place__description'>
                    {place.description.length > 100 
                      ? `${place.description.slice(0, 100)}...` 
                      : place.description
                    }
                  </p>
                  {place.address && (
                    <div className='place__address'>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{place.address}</span>
                    </div>
                  )}
                </div>
                
                <div className='place__actions'>
                  <button 
                    className='btn-edit'
                    onClick={() => handleEdit(place)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span>수정</span>
                  </button>
                  <button 
                    className='btn-delete'
                    onClick={() => handleDelete(place)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>삭제</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 수정 모달 */}
      {editingPlace && (
        <div className='edit__modal-overlay'>
          <div className='edit__modal'>
            <div className='modal__header'>
              <h2>장소 정보 수정</h2>
              <button 
                className='modal__close'
                onClick={() => setEditingPlace(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className='modal__content'>
              <div className='form__group'>
                <label>장소명</label>
                <input
                  type='text'
                  value={editForm.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  placeholder='장소명을 입력하세요'
                />
              </div>

              <div className='form__group'>
                <label>카테고리</label>
                <select
                  value={editForm.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                >
                  <option value='맛집'>맛집</option>
                  <option value='카페 & 베이커리'>카페 & 베이커리</option>
                  <option value='풍경'>풍경</option>
                  <option value='술집'>술집</option>
                  <option value='숙소'>숙소</option>
                  <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
                </select>
              </div>

              <div className='form__group'>
                <label>설명</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder='장소에 대한 설명을 입력하세요'
                  rows={4}
                />
              </div>

              <div className='form__group'>
                <label>주소</label>
                <input
                  type='text'
                  value={editForm.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  placeholder='주소를 입력하세요'
                />
              </div>

              <div className='form__group'>
                <label>관련 링크</label>
                <input
                  type='url'
                  value={editForm.url}
                  onChange={(e) => handleFormChange('url', e.target.value)}
                  placeholder='관련 웹사이트 URL을 입력하세요'
                />
              </div>

              <div className='form__group'>
                <label>이미지 URL</label>
                {editForm.attachmentUrlArray.map((url, index) => (
                  <div key={index} className='image__input-group'>
                    <input
                      type='url'
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      placeholder='이미지 URL을 입력하세요'
                    />
                    {editForm.attachmentUrlArray.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeImageUrl(index)}
                        className='btn-remove-image'
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={addImageUrl}
                  className='btn-add-image'
                >
                  <FontAwesomeIcon icon={faImage} />
                  <span>이미지 추가</span>
                </button>
              </div>
            </div>

            <div className='modal__footer'>
              <button
                className='btn-cancel'
                onClick={() => setEditingPlace(null)}
              >
                취소
              </button>
              <button
                className='btn-save'
                onClick={handleUpdate}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>저장 중...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    <span>저장</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Edit;