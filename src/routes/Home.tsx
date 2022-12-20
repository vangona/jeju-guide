import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import List from '../components/List';
import Map from '../components/Map';
import Modal from '../components/Modal';
import Navigation from '../components/Navigation';
import { dbService } from '../fBase';
import Profile from './Profile';
import type { PlaceInfo, UserObj } from '../types';

interface LocationProps {
  prevViewType: string;
}

interface HomeProps {
  isMobile: boolean;
  userObj: UserObj;
}

const Home = ({ isMobile, userObj }: HomeProps) => {
  const location = useLocation<LocationProps>();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [viewType, setViewType] = useState('지도');
  const [chatState, setChatState] = useState<boolean>(false);

  const localItems = localStorage.getItem('micheltain_myplace');
  const localArray = localItems ? JSON.parse(localItems) : [];

  const getPlaces = async () => {
    dbService.collection('places').onSnapshot((snapshot) => {
      const placeArray = snapshot.docs.map((doc) => ({
        ...(doc.data() as PlaceInfo),
      }));
      setPlaces(placeArray);
      setLoading(true);
    });
  };

  useEffect(() => {
    getPlaces();
    if (location.state) {
      setViewType(location.state.prevViewType);
    }
  }, []);
  return (
    <div className='home__container'>
      <div className='vertical'>
        <h3 className='home__title'>MICHETAIN GUIDE</h3>
        {/* <button className="home-viewtype" onClick={onClickMap}><FontAwesomeIcon icon={faExchangeAlt} /> {viewType === "지도" ? "리스트로 보기" : "지도로 보기"}</button>    */}
        {loading === true && viewType === '지도' ? (
          <Map
            places={places}
            localArray={localArray}
            isMobile={isMobile}
            setDetail={setDetail}
            chatState={chatState}
          />
        ) : loading === true && viewType === '목록' ? (
          <List places={places} localArray={localArray} isMobile={isMobile} />
        ) : loading === true && viewType === '프로필' ? (
          <Profile userObj={userObj} />
        ) : (
          'Loading...'
        )}
      </div>
      {detail && <Modal place={detail} setModalState={setDetail} />}
      {/* <Link to="/myplace"><button>내 여행지 목록</button></Link> */}
      <Navigation setViewType={setViewType} setChatSate={setChatState} />
    </div>
  );
};

export default Home;
