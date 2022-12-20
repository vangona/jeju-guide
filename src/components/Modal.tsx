import React from 'react';
import { Link } from 'react-router-dom';
import { PlaceInfo } from '../types';

interface ModalProps {
  place: PlaceInfo;
  handleModalContentChange: (newDetail: PlaceInfo | null) => void;
}

const Modal = ({ place, handleModalContentChange }: ModalProps) => {
  const onBackgroundClick = () => {
    handleModalContentChange(null);
  };

  return (
    <div onClick={onBackgroundClick} className='modal-background'>
      <div className='map-detail__container modal-container'>
        <div className='map__detail vertical'>
          <h3>{place.name}</h3>
          {place.attachmentUrlArray[0] && (
            <>
              <img
                className='map-detail__img'
                src={place.attachmentUrlArray[0]}
                alt='detail-img'
                width='100%'
                height='auto'
              />
              {/* <div className="map-detail__img-btn__container">
                                    {imgPage !== 0 && <button className="map-detail__img-btn prev" onClick={clickPrevImg}>◀</button>}
                                    {imgPage !== detail.attachmentUrlArray.length -1 & detail.attachmentUrlArray.lenth !== 1 ? <button className="map-detail__img-btn next" onClick={clickNextImg}>▶</button> : null}
                                </div> */}
            </>
          )}
          <div className='map-detail__description'>
            {place.description.length > 100
              ? place.description.slice(0, 100) + '...'
              : place.description}
          </div>
          <div>
            {place.url !== '' && (
              <a href={place.url} target='_blank' rel='noreferrer'>
                <button className='map-detail__url map-detail__btn'>
                  관련 사이트
                </button>
              </a>
            )}
            <Link
              to={{
                pathname: `/detail/${place.name}`,
                state: {
                  from: '지도',
                },
              }}
            >
              <button className='map-detail__detail map-detail__btn'>
                더 알아보기
              </button>
            </Link>
          </div>
          {/* <AddMyPlace place={detail}/> */}
          <div className='map__detail-clear' onClick={onBackgroundClick}>
            ❌
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
