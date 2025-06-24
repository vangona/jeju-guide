import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faMapMarkerAlt,
  faImage,
  faExternalLinkAlt,
  faInfoCircle,
  faTag,
  faTimes,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { dbService } from '../../fBase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import AddMyPlace from '../../components/AddMyPlace';
import type { PlaceInfo } from '../../types';

const Detail = () => {
  const router = useRouter();
  const { place } = router.query;
  const from = (router.query.prevViewType as string) || '지도';
  const [detailPlace, setDetailPlace] = useState<PlaceInfo>();
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const onBackClick = () => {
    router.push({
      pathname: '/',
      query: {
        prevViewType: from,
      },
    });
  };

  const onHomeClick = () => {
    router.push('/');
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(detailPlace?.addressDetail || detailPlace?.address || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = detailPlace?.addressDetail || detailPlace?.address || '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPlaceName = async () => {
    if (!place) return;
    
    const placeName = Array.isArray(place) ? place[0] : place;
    const q = query(collection(dbService, 'places'), where('name', '==', placeName));
    
    onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const placeData = snapshot.docs[0].data() as PlaceInfo;
        setDetailPlace(placeData);
        setDetailLoading(true);
        setLoadedImages(new Set()); // Reset loaded images when place changes
      }
    });
  };

  useEffect(() => {
    getPlaceName();
  }, [place]);

  // Enable scrolling for Detail page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.classList.add('detail__page-active');
    
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.classList.remove('detail__page-active');
    };
  }, []);

  if (!detailLoading) {
    return (
      <div className='detail__page detail__page--loading'>
        <div className='detail__background'>
          <div className='detail__wave'></div>
          <div className='detail__wave'></div>
          <div className='detail__wave'></div>
        </div>
        <div className='loading__container'>
          <div className='loading__spinner'></div>
          <p>장소 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='detail__page'>
      {/* Background */}
      <div className='detail__background'>
        <div className='detail__wave'></div>
        <div className='detail__wave'></div>
        <div className='detail__wave'></div>
      </div>


      {/* Header */}
      <header className='detail__header'>
        <div className='detail__nav'>
          <button className='nav-btn nav-btn--back' onClick={onBackClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          
          <div className='detail__title-section'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='title-icon' />
            <h1 className='detail__title'>장소 상세</h1>
          </div>

          <button className='nav-btn nav-btn--home' onClick={onHomeClick}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='detail__content'>
        <div className='detail__container'>
          <div className='detail__card'>
            {/* Place Name */}
            <div className='detail__header-info'>
              <h2 className='detail__name'>{detailPlace?.name}</h2>
              {detailPlace?.type && (
                <span className='detail__type'>
                  <FontAwesomeIcon icon={faTag} />
                  {detailPlace.type}
                </span>
              )}
            </div>

            {/* Images */}
            {detailPlace?.attachmentUrlArray && detailPlace.attachmentUrlArray.length > 0 && (
              <div className='detail__image-section'>
                {detailPlace.attachmentUrlArray.length === 1 ? (
                  // Single image
                  <div className='detail__single-image'>
                    <div className='swiper-zoom-container'>
                      {!loadedImages.has(0) && (
                        <div className='image-skeleton'>
                          <div className='skeleton-shimmer'></div>
                        </div>
                      )}
                      <img
                        className={`detail__image ${loadedImages.has(0) ? 'loaded' : 'loading'}`}
                        src={detailPlace.attachmentUrlArray[0]}
                        alt={`${detailPlace.name} 이미지`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(0)}
                      />
                    </div>
                  </div>
                ) : (
                  // Multiple images with Swiper
                  <div className='detail__image-gallery'>
                    <Swiper
                      modules={[Navigation, Pagination, Zoom]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation
                      pagination={{ 
                        clickable: true,
                        dynamicBullets: true
                      }}
                      zoom={{
                        maxRatio: 3,
                        minRatio: 1
                      }}
                      className='detail__swiper'
                    >
                      {detailPlace.attachmentUrlArray.map((imageUrl, index) => (
                        <SwiperSlide key={index}>
                          <div className='swiper-zoom-container'>
                            {!loadedImages.has(index) && (
                              <div className='image-skeleton'>
                                <div className='skeleton-shimmer'></div>
                              </div>
                            )}
                            <img
                              className={`detail__image ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                              src={imageUrl}
                              alt={`${detailPlace.name} 이미지 ${index + 1}`}
                              loading="lazy"
                              onLoad={() => handleImageLoad(index)}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {detailPlace.attachmentUrlArray.length > 1 && (
                      <div className='image-count'>
                        <FontAwesomeIcon icon={faImage} />
                        {detailPlace.attachmentUrlArray.length}장의 사진
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className='detail__description-section'>
              <h3 className='section__title'>
                <FontAwesomeIcon icon={faInfoCircle} />
                상세 설명
              </h3>
              <p className='detail__description'>{detailPlace?.description}</p>
            </div>

            {/* Address */}
            {detailPlace?.addressDetail && (
              <div className='detail__address-section'>
                <div className='detail__address'>
                  <div className='address-content'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className='address-icon' />
                    <span className='address-text'>{detailPlace.addressDetail}</span>
                  </div>
                  <button 
                    className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                    onClick={copyAddress}
                    aria-label="주소 복사"
                    title={copied ? '복사됨!' : '주소 복사'}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className='detail__actions'>
              {detailPlace && (
                <AddMyPlace place={detailPlace} size="large" showLabel={true} />
              )}
              
              {detailPlace?.url && (
                <a 
                  href={detailPlace.url} 
                  target='_blank' 
                  rel='noreferrer'
                  className='detail__external-link'
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  <span>관련 사이트</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='detail__footer'>
        <span className='copyright'>
          &copy; {new Date().getFullYear().toString()}, 나만의 서랍장 Co. all rights reserved.
        </span>
      </footer>

      {/* Floating Close Button - Bottom Right */}
      <button className='detail__close-btn' onClick={onBackClick} title="메인으로 돌아가기">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Detail;