import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
import Navigation from '../components/Navigation';

const Tips = () => {
  const navigate = useNavigate();

  const clickBackBtn = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  // Navigation handlers
  const handleViewTypeChange = (newViewType: string) => {
    if (newViewType === '지도' || newViewType === '목록') {
      navigate('/');
    }
  };

  const handleChatStateChange = (newChatState: boolean) => {
    // Chat functionality - could navigate to home with chat enabled
    navigate('/');
  };

  return (
    <div className='detail__container'>
      <header className='tips__header'>
        <div className='tips__nav'>
          <button className='nav-btn nav-btn--back' onClick={clickBackBtn}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          <h1 className='tips__title'>제주 가이드 팁</h1>
          <button className='nav-btn nav-btn--home' onClick={goHome}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>
      <div className='detail-box tips-box'>
        <h5>장기여행자 들려주는 꿀팁들</h5>
        <ul className='tips__list'>
          <li>
            꿀팁 1. 제주도에는 실시간 버스 정보 시스템이 별도로 존재한다.
            뚜벅이라면 꼭 참고하도록 하자. <br />{' '}
            <a href='http://bus.jeju.go.kr/'>버스 정보 시스템 바로가기</a>
          </li>
          <li>
            꿀팁 2. 제주도에는 공항에서 숙소, 숙소에서 숙소, 숙소에서 공항 등
            들고 돌아다니기 부담스러울 수 있는 짐을 옮겨주는 '짐 옮기기
            서비스'가 아주 잘되어있다. 뚜벅이는 적극 이용해보자.
          </li>
          <li>
            꿀팁 3. 제주도에서 제대로 걸어보고 싶다면 올레길을 적극 이용해보자.
            이용해본 후기는 '굳이 저기를 걸어봐야해?' 라고 지나가려던 숨은
            명소를 다 보내버린다.
          </li>
          <li>
            꿀팁 4. 개인적으로 용눈이오름을 제외하고, 노을은 서쪽이 예뻤다. 해는
            서쪽으로 지기 때문일까
          </li>
          <li>
            꿀팁 5. 로컬들이 뽑는 가장 좋은 제주도의 계절은 가을이다. 사람도
            적당히 없고, 정말 예쁘다.
          </li>
          <li>
            꿀팁 6. 제주도는 어딘가에서 상처받은 사람이 많이 모인다. 그렇기에
            정성을 담은 서비스가 많았다. 여기에 모여있는 맛집과 서비스들은 주로
            그런 곳을 선정했다. 당신의 그런 공간도 찾아보면 좋겠다.
          </li>
        </ul>
        <div className='maker-int'>
          <h5 style={{ textAlign: 'center' }}>만든이 소개</h5>
          <h6 className='maker-int__name'>1. 장기여행자 : 김관경</h6>
          <ul style={{ fontSize: '0.8rem' }}>
            <li>- 제주도를 7개월간 여행하였다.</li>
            <li>- 뚜벅초와 개발을 맡고있다.</li>
          </ul>
          <div className='maker-icons__container'>
            <span className='maker-icons'>
              <a href='https://www.instagram.com/van_gona_/' target='_blank'>
                인스타그램 아이콘
              </a>
              <a href='https://www.facebook.com/gonavankim' target='_blank'>
                페이스북 아이콘
              </a>
              <a href='https://github.com/vangona/' target='_blank'>
                깃허브 아이콘
              </a>
            </span>
          </div>
          <h6 className='maker-int__name'>2. 제주살이꾼 : 박태훈</h6>
          <p style={{ fontSize: '0.8rem' }}>
            <li>- 제주도에 5년간 살았다.</li>
            <li>
              - 제주도 숨은 맛집과 명소 탐방, 미슐탱 가이드 이름의 어원을
              맡고있다.
            </li>
            <li>- SUPER DRIVER</li>
          </p>
          <div className='maker-icons__container'>
            <span className='maker-icons'>
              <a href='https://www.instagram.com/van_gona_/' target='_blank'>
                인스타그램 아이콘
              </a>
            </span>
          </div>
          <h5>도와주신 분들 & 저작권 표시</h5>
          <div>
            Icons made by{' '}
            <a href='https://www.freepik.com' title='Freepik'>
              Freepik
            </a>{' '}
            from{' '}
            <a href='https://www.flaticon.com/' title='Flaticon'>
              www.flaticon.com
            </a>
          </div>
          <div>
            Icons made by{' '}
            <a href='' title='iconixar'>
              iconixar
            </a>{' '}
            from{' '}
            <a href='https://www.flaticon.com/' title='Flaticon'>
              www.flaticon.com
            </a>
          </div>
          <div>
            Icons made by{' '}
            <a href='https://www.freepik.com' title='Freepik'>
              Freepik
            </a>{' '}
            from{' '}
            <a href='https://www.flaticon.com/' title='Flaticon'>
              www.flaticon.com
            </a>
          </div>
        </div>
        <ins
          className='kakao_ad_area'
          style={{ display: 'none' }}
          data-ad-unit='DAN-c9rNVYJ0iiSwi4Sm'
          data-ad-width='320'
          data-ad-height='50'
        ></ins>
      </div>
      <span className='copyright'>
        &copy; {new Date().getFullYear().toString()}, 나만의 서랍장 Co. all rights reserved.
      </span>
      
      <Navigation 
        handleViewTypeChange={handleViewTypeChange}
        handleChatStateChange={handleChatStateChange}
      />
    </div>
  );
};

export default Tips;
