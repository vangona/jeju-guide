import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { dbService } from '../fBase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import AddMyPlace from '../components/AddMyPlace';
import type { PlaceInfo } from '../types';

interface LocationState {
  from: string;
}

const Detail = () => {
  const { place } = useParams<{ place?: string }>();
  const location = useLocation();
  const locationState = location.state as LocationState | null;
  let from = '지도';
  if (locationState) {
    from = locationState.from;
  }
  const navigate = useNavigate();
  const [detailPlace, setDetailPlace] = useState<PlaceInfo>();
  const [imgPage, setImgPage] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  const clickBackBtn = () => {
    navigate('/', {
      state: {
        prevViewType: from,
      },
    });
  };

  const clickNextImg = () => {
    if (imgPage < 4) {
      setImgPage((prev) => prev + 1);
    }
  };

  const clickPrevImg = () => {
    if (imgPage > 0) {
      setImgPage((prev) => prev - 1);
    }
  };

  const getPlaceName = async () => {
    if (!place) return;
    
    const q = query(collection(dbService, 'places'), where('name', '==', place));
    
    onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const placeData = snapshot.docs[0].data() as PlaceInfo;
        setDetailPlace(placeData);
        setDetailLoading(true);
      }
    });
  };

  useEffect(() => {
    getPlaceName();
  }, []);
  return (
    <>
      {detailLoading ? (
        <div className='detail__container'>
          <div className='detail-box'>
            <div className='detail__name'>{detailPlace?.name}</div>
            {detailPlace?.attachmentUrlArray[imgPage] ? (
              <div className='detail-img__container'>
                <img
                  className='detail__img'
                  src={detailPlace?.attachmentUrlArray[imgPage]}
                  style={{ maxWidth: '100%' }}
                  alt='detail-img'
                />
                <div className='detail-img-btn__container'>
                  {imgPage !== 0 && (
                    <button
                      className='detail__prev detail-btn'
                      onClick={clickPrevImg}
                    >
                      버튼
                    </button>
                  )}
                  {imgPage !== detailPlace?.attachmentUrlArray.length - 1 &&
                  detailPlace?.attachmentUrlArray.length !== 1 ? (
                    <button
                      className='detail__next detail-btn'
                      onClick={clickNextImg}
                    >
                      버튼
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
            <p className='detail__description'>{detailPlace?.description}</p>
            {detailPlace && (
              <div className="detail__add-to-plan">
                <AddMyPlace place={detailPlace} size="large" showLabel={true} />
              </div>
            )}
            <ins
              className='kakao_ad_area'
              style={{ display: 'none' }}
              data-ad-unit='DAN-c9rNVYJ0iiSwi4Sm'
              data-ad-width='320'
              data-ad-height='50'
            ></ins>
            <button style={{ marginTop: '1rem' }} onClick={clickBackBtn}>
              돌아가기
            </button>
          </div>
          <span className='copyright'>
            &copy; 2021, 나만의 서랍장 Co. all rights reserved.
          </span>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  );
};

export default Detail;
