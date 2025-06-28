import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { PlaceInfo } from '../types';

interface AddMyPlaceProps {
  place: PlaceInfo;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onUpdate?: () => void;
  onRemoveConfirm?: (place: PlaceInfo) => Promise<boolean>;
}

const AddMyPlace = ({
  place,
  size = 'medium',
  showLabel = false,
  onUpdate,
  onRemoveConfirm,
}: AddMyPlaceProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 저장된 상태 확인
    const placeLocalArray = localStorage.getItem('micheltain_myplace');
    if (placeLocalArray) {
      const parsedPlaceArray = JSON.parse(placeLocalArray);
      const isPlaceAdded = parsedPlaceArray.some(
        (localplace: PlaceInfo) => localplace.name === place.name,
      );
      setIsAdded(isPlaceAdded);
    }
  }, [place.name]);

  const handleAddToMyPlace = async () => {
    if (isAdded) {
      // 이미 추가된 경우 제거 - 확인 대화상자 표시
      if (onRemoveConfirm) {
        const shouldRemove = await onRemoveConfirm(place);
        if (!shouldRemove) return;
      }

      const placeLocalArray = localStorage.getItem('micheltain_myplace');
      if (placeLocalArray) {
        const parsedPlaceArray = JSON.parse(placeLocalArray);
        const filteredArray = parsedPlaceArray.filter(
          (localplace: PlaceInfo) => localplace.name !== place.name,
        );
        localStorage.setItem(
          'micheltain_myplace',
          JSON.stringify(filteredArray),
        );
        setIsAdded(false);
        onUpdate?.();
      }
    } else {
      // 새로 추가
      const placeLocalArray = localStorage.getItem('micheltain_myplace');
      const parsedPlaceArray = placeLocalArray
        ? JSON.parse(placeLocalArray)
        : [];

      if (
        !parsedPlaceArray.some(
          (localplace: PlaceInfo) => localplace.name === place.name,
        )
      ) {
        localStorage.setItem(
          'micheltain_myplace',
          JSON.stringify([...parsedPlaceArray, place]),
        );
        setIsAdded(true);
        setIsAnimating(true);
        onUpdate?.();

        // 애니메이션 효과
        setTimeout(() => setIsAnimating(false), 600);
      }
    }
  };

  const getButtonClass = () => {
    let baseClass = 'add-my-place-btn';
    baseClass += ` add-my-place-btn--${size}`;
    if (isAdded) baseClass += ' add-my-place-btn--added';
    if (isAnimating) baseClass += ' add-my-place-btn--animating';
    return baseClass;
  };

  const getIcon = () => {
    if (isAnimating) return faCheck;
    if (isAdded) return faHeart;
    return faPlus;
  };

  const getLabel = () => {
    if (isAdded) return '저장됨';
    return '여행 계획에 추가';
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleAddToMyPlace}
      aria-label={isAdded ? '여행 계획에서 제거' : '여행 계획에 추가'}
      title={getLabel()}
    >
      <FontAwesomeIcon icon={getIcon()} />
      {showLabel && <span className='add-my-place-label'>{getLabel()}</span>}
    </button>
  );
};

export default AddMyPlace;
