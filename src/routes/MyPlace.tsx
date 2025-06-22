import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlaceInfo } from '../types';

const MyPlace = () => {
  const navigate = useNavigate();
  const [myPlaceArray, setMyPlaceArray] = useState<PlaceInfo[] | false>([]);
  const clickBackBtn = () => {
    navigate('/', {
      state: {
        prevViewType: '목록',
      },
    });
  };

  useEffect(() => {
    const localMyPlace = localStorage.getItem('micheltain_myplace');
    const parsedMyPlace = localMyPlace ? JSON.parse(localMyPlace) : false;
    setMyPlaceArray(parsedMyPlace);
  }, []);

  if (!myPlaceArray) {
    return <></>;
  }

  return (
    <>
      {myPlaceArray && (
        <>
          {myPlaceArray.map((myPlace) => {
            return (
              <>
                <div>{myPlace.name}</div>
                <div>{myPlace.description}</div>
              </>
            );
          })}
        </>
      )}
      <button onClick={clickBackBtn}>Back</button>
    </>
  );
};

export default MyPlace;
