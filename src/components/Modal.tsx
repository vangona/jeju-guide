import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faExternalLinkAlt, 
  faInfoCircle,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { PlaceInfo } from '../types';
import AddMyPlace from './AddMyPlace';

interface ModalProps {
  place: PlaceInfo;
  handleModalContentChange: (newDetail: PlaceInfo | null) => void;
}

const Modal = ({ place, handleModalContentChange }: ModalProps) => {
  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalContentChange(null);
    }
  };

  const onCloseClick = () => {
    handleModalContentChange(null);
  };

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
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className='modal-content'>
        {/* Header */}
        <div className='modal-header'>
          <div className='modal-title-section'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='modal-location-icon' />
            <h2 id="modal-title" className='modal-title'>{place.name}</h2>
          </div>
          <button 
            className='modal-close-btn'
            onClick={onCloseClick}
            aria-label="모달 닫기"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Content */}
        <div className='modal-body'>
          {/* Image */}
          {place.attachmentUrlArray[0] && (
            <div className='modal-image-container'>
              <img
                className='modal-image'
                src={place.attachmentUrlArray[0]}
                alt={`${place.name} 이미지`}
                loading="lazy"
              />
            </div>
          )}

          {/* Place Type */}
          {place.type && (
            <span className='modal-place-type'>{place.type}</span>
          )}

          {/* Description */}
          <div className='modal-description'>
            {place.description}
          </div>

          {/* Address */}
          {place.address && (
            <div className='modal-address'>
              <FontAwesomeIcon icon={faMapMarkerAlt} className='address-icon' />
              <span>{place.address}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='modal-footer'>
          <div className='modal-actions'>
            <AddMyPlace place={place} size="medium" showLabel={true} />
            
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
              to={`/detail/${place.name}`}
              state={{ from: '지도' }}
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