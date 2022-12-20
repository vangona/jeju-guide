import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { dbService } from '../fBase';
import type { PlaceInfo } from '../types';

interface LocationProps {
  from: string;
}

const Detail = () => {
  const { place } = useParams<{ place?: string }>();
  const location = useLocation<LocationProps>();
  let from = '지도';
  if (location.state) {
    from = location.state.from;
  }
  const history = useHistory();
  const [detailPlace, setDetailPlace] = useState<PlaceInfo>();
  const [imgPage, setImgPage] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  const clickBackBtn = () => {
    history.push({
      pathname: '/',
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
    dbService
      .collection('places')
      .where('name', '==', place)
      .onSnapshot((snapshot) => {
        const placeData = snapshot.docs[0].data() as PlaceInfo; // DocumentData라는 타입으로 와서 PlaceInfo로 TypeCasting
        setDetailPlace(placeData);
        setDetailLoading(true);
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
            {/* <AddMyPlace place={place}/> */}
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
