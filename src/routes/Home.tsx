import React, { useEffect, useState, useCallback, useRef } from 'react';
import List from '../components/List';
import Map from '../components/Map';
import Modal from '../components/Modal';
import Navigation from '../components/Navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import AIChat from '../components/AIChat';
import { dbService } from '../fBase';
import { collection, onSnapshot } from 'firebase/firestore';
import Profile from './Profile';
import type { PlaceInfo, UserObj } from '../types';
import { cx } from '../utils';

interface HomeProps {
  isMobile: boolean;
  userObj: UserObj | null;
}

const Home = ({ isMobile, userObj }: HomeProps) => {
  const [detail, setDetail] = useState<PlaceInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [viewType, setViewType] = useState('지도');
  const [showAIChat, setShowAIChat] = useState(false);

  const getPlaces = useCallback(() => {
    const unsubscribe = onSnapshot(collection(dbService, 'places'), (snapshot) => {
      const placeArray = snapshot.docs.map((doc) => ({
        ...(doc.data() as PlaceInfo),
      }));
      setPlaces(placeArray);
      setLoading(true);
    });
    return unsubscribe;
  }, []);

  const handleChangeDetail = useCallback((newDetail: PlaceInfo | null) => {
    setDetail(newDetail);
  }, []);

  const handleViewTypeChange = useCallback((newViewType: string) => {
    setViewType(newViewType);
  }, []);

  const handlePlaceSelect = useCallback((place: PlaceInfo) => {
    // AI Chat에서 장소 선택 시 모달 열기
    setDetail(place);
  }, []);

  useEffect(() => {
    const unsubscribe = getPlaces();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getPlaces]);

  return (
    <div className='home__container'>
      <div className='vertical'>
        <h3 className='home__title'>MICHETAIN GUIDE</h3>
        {/* <button className="home-viewtype" onClick={onClickMap}><FontAwesomeIcon icon={faExchangeAlt} /> {viewType === "지도" ? "리스트로 보기" : "지도로 보기"}</button>    */}
        {loading === true && viewType === '지도' ? (
          <Map
            places={places}
            isMobile={isMobile}
            handleChangeDetail={handleChangeDetail}
            chatState={true}
          />
        ) : loading === true && viewType === '목록' ? (
          <List places={places} isMobile={isMobile} />
        ) : loading === true && viewType === '프로필' ? (
          <Profile userObj={userObj} />
        ) : (
          <LoadingSpinner message='장소 정보를 불러오고 있습니다...' />
        )}
      </div>
      {detail && (
        <Modal place={detail} handleModalContentChange={handleChangeDetail} />
      )}
      <AIChat
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onPlaceSelect={handlePlaceSelect}
        isMobile={isMobile}
      />
      <button
        onClick={() => setShowAIChat(true)}
        className={cx('ai-chat-fab', { 'invisible': showAIChat })}
        title='AI 여행 가이드와 채팅하기'
      >
        <div className='fab-icon-container'>
          <svg
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='fab-icon'
          >
            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
            <circle cx='9' cy='10' r='1' />
            <circle cx='15' cy='10' r='1' />
            <path d='M9 14c.5.5 2 1 3 1s2.5-.5 3-1' />
          </svg>
        </div>
        <span className='fab-tooltip'>AI 가이드</span>
      </button>
      {/* <Link to="/myplace"><button>내 여행지 목록</button></Link> */}
      <Navigation handleViewTypeChange={handleViewTypeChange} />
    </div>
  );
};

export default Home;
