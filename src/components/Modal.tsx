import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faExternalLinkAlt,
  faInfoCircle,
  faMapMarkerAlt,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { PlaceInfo } from '../types';
import AddMyPlace from './AddMyPlace';

interface ModalProps {
  place: PlaceInfo;
  handleModalContentChange: (newDetail: PlaceInfo | null) => void;
}

const Modal = ({ place, handleModalContentChange }: ModalProps) => {
  const [copied, setCopied] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalContentChange(null);
    }
  };

  const onCloseClick = () => {
    handleModalContentChange(null);
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        place.addressDetail || place.address || '',
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = place.addressDetail || place.address || '';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  };

  // Reset loaded images when place changes
  useEffect(() => {
    setLoadedImages(new Set());
  }, [place.id]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleModalContentChange(null);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [handleModalContentChange]);

  return (
    <div
      onClick={onBackgroundClick}
      className='modal-overlay'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
    >
      <div className='modal-content'>
        {/* Header */}
        <div className='modal-header'>
          <div className='modal-title-section'>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className='modal-location-icon'
            />
            <h2 id='modal-title' className='modal-title'>
              {place.name}
            </h2>
          </div>
          <button
            className='modal-close-btn'
            onClick={onCloseClick}
            aria-label='모달 닫기'
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className='modal-body'>
          {/* Images */}
          {place.attachmentUrlArray && place.attachmentUrlArray.length > 0 && (
            <div className='modal-image-container'>
              {place.attachmentUrlArray.length === 1 ? (
                // Single image
                <div className='swiper-zoom-container'>
                  {!loadedImages.has(0) && (
                    <div className='image-skeleton'>
                      <div className='skeleton-shimmer'></div>
                    </div>
                  )}
                  <img
                    className={`modal-image ${loadedImages.has(0) ? 'loaded' : 'loading'}`}
                    src={place.attachmentUrlArray[0]}
                    alt={`${place.name} 이미지`}
                    loading='lazy'
                    onLoad={() => handleImageLoad(0)}
                  />
                </div>
              ) : (
                // Multiple images with Swiper
                <Swiper
                  modules={[Navigation, Pagination, Zoom]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  zoom={{
                    maxRatio: 3,
                    minRatio: 1,
                  }}
                  className='modal-swiper'
                >
                  {place.attachmentUrlArray.map((imageUrl, index) => (
                    <SwiperSlide key={index}>
                      <div className='swiper-zoom-container'>
                        {!loadedImages.has(index) && (
                          <div className='image-skeleton'>
                            <div className='skeleton-shimmer'></div>
                          </div>
                        )}
                        <img
                          className={`modal-image ${loadedImages.has(index) ? 'loaded' : 'loading'}`}
                          src={imageUrl}
                          alt={`${place.name} 이미지 ${index + 1}`}
                          loading='lazy'
                          onLoad={() => handleImageLoad(index)}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {place.attachmentUrlArray.length > 1 && (
                <div className='image-count'>
                  {place.attachmentUrlArray.length}장의 사진
                </div>
              )}
            </div>
          )}

          {/* Place Type */}
          {place.type && <span className='modal-place-type'>{place.type}</span>}

          {/* Description */}
          <div className='modal-description'>{place.description}</div>

          {/* Address */}
          {place.address && (
            <div className='modal-address'>
              <div className='address-content'>
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className='address-icon'
                />
                <span className='address-text'>{place.addressDetail}</span>
              </div>
              <button
                className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
                onClick={copyAddress}
                aria-label='주소 복사'
                title={copied ? '복사됨!' : '주소 복사'}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='modal-footer'>
          <div className='modal-actions'>
            <AddMyPlace place={place} size='medium' showLabel={true} />

            {place.url && (
              <a
                href={place.url}
                target='_blank'
                rel='noreferrer'
                className='modal-btn modal-btn--secondary'
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                <span>관련 사이트</span>
              </a>
            )}

            <Link
              href={`/detail/${place.name}`}
              className='modal-btn modal-btn--primary'
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>자세히 보기</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
