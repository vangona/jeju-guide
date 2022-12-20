import React from 'react';
import type { PlaceInfo } from '../types';

interface AddMyPlaceProps {
  place: PlaceInfo;
}

const AddMyPlace = ({ place }: AddMyPlaceProps) => {
  const onClickAddBtn = () => {
    const placeLocalArray = localStorage.getItem('micheltain_myplace');
    const parsedPlaceArray = placeLocalArray
      ? JSON.parse(placeLocalArray)
      : null;

    if (!parsedPlaceArray) {
      localStorage.setItem('micheltain_myplace', JSON.stringify([place]));
      return;
    }

    if (
      parsedPlaceArray.some(
        (localplace: PlaceInfo) => localplace.name === place.name,
      )
    ) {
      alert('이미 추가된 항목입니다.');
    } else {
      localStorage.setItem(
        'micheltain_myplace',
        JSON.stringify([...parsedPlaceArray, place]),
      );
    }
  };

  return <button onClick={onClickAddBtn}>더하기 아이콘</button>;
};

export default AddMyPlace;
