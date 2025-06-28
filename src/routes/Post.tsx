import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faSignOutAlt,
  faUser,
  faMapMarkerAlt,
  faPlus,
  faLightbulb,
  faCamera,
  faLocation,
  faChevronUp,
  faChevronDown,
  faQuestionCircle,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import PostForm from '../components/PostForm';
import { authService } from '../fBase';
import type { UserObj } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PostProps {
  userObj: UserObj | null;
}

const Post = ({ userObj }: PostProps) => {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showTips, setShowTips] = useState(true);

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!userObj) {
      router.push('/auth');
    }
  }, [userObj, router]);

  // 사용자 선호도 로드
  useEffect(() => {
    const hideIntro = localStorage.getItem('hidePostIntro') === 'true';
    const hideTips = localStorage.getItem('hidePostTips') === 'true';
    setShowIntro(!hideIntro);
    setShowTips(!hideTips);
  }, []);

  const toggleIntro = () => {
    const newShowIntro = !showIntro;
    setShowIntro(newShowIntro);
    localStorage.setItem('hidePostIntro', String(!newShowIntro));
  };

  const toggleTips = () => {
    const newShowTips = !showTips;
    setShowTips(newShowTips);
    localStorage.setItem('hidePostTips', String(!newShowTips));
  };

  const onLogOutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      authService.signOut();
      router.push('/');
    }
  };

  const onHomeClick = () => {
    router.push('/');
  };

  const onBackClick = () => {
    router.back();
  };

  const onAdminClick = () => {
    router.push('/admin');
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  if (!userObj) {
    return null; // 로딩 중이거나 리다이렉트 중
  }

  const tips = [
    {
      icon: faCamera,
      title: '사진 팁',
      description:
        '자연광이 좋은 시간대에 촬영하면 더 아름다운 사진을 얻을 수 있어요',
    },
    {
      icon: faLocation,
      title: '위치 정보',
      description: '정확한 주소를 입력하면 다른 여행자들이 쉽게 찾을 수 있어요',
    },
    {
      icon: faLightbulb,
      title: '꿀팁 공유',
      description:
        '운영시간, 주차정보, 특별한 메뉴 등 실용적인 정보를 포함해보세요',
    },
  ];

  return (
    <div className='post__page'>
      <div className='post__background'>
        <div className='post__wave'></div>
        <div className='post__wave'></div>
        <div className='post__wave'></div>
      </div>

      <header className='post__header'>
        <div className='post__nav'>
          <button className='nav-btn nav-btn--back' onClick={onBackClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>

          <div className='post__title-section'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='title-icon' />
            <h1 className='post__title'>새 장소 등록</h1>
          </div>

          <div className='post__user-section'>
            <button className='user-profile-btn' onClick={toggleProfile}>
              <FontAwesomeIcon icon={faUser} />
              <span className='user-name'>
                {userObj.displayName || '사용자'}
              </span>
            </button>

            {showProfile && (
              <div className='profile__dropdown'>
                <div className='profile__info'>
                  <div className='profile__avatar'>
                    {userObj.photoURL ? (
                      <img src={userObj.photoURL} alt='프로필' />
                    ) : (
                      <FontAwesomeIcon icon={faUser} />
                    )}
                  </div>
                  <div className='profile__details'>
                    <p className='profile__name'>
                      {userObj.displayName || '익명 사용자'}
                    </p>
                    <p className='profile__email'>{userObj.uid}</p>
                  </div>
                </div>

                <div className='profile__actions'>
                  <button className='profile__action' onClick={onHomeClick}>
                    <FontAwesomeIcon icon={faHome} />
                    <span>홈으로</span>
                  </button>
                  <button className='profile__action' onClick={onAdminClick}>
                    <FontAwesomeIcon icon={faCog} />
                    <span>관리자</span>
                  </button>
                  <button
                    className='profile__action profile__action--logout'
                    onClick={onLogOutClick}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className='post__content'>
        {/* Collapsible Intro */}
        <div className='post__intro-section'>
          <div className='section-toggle'>
            <button
              className='toggle-btn'
              onClick={toggleIntro}
              aria-label={showIntro ? '소개 숨기기' : '소개 보기'}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              <span>장소 등록이 처음이신가요?</span>
              <FontAwesomeIcon icon={showIntro ? faChevronUp : faChevronDown} />
            </button>
          </div>

          {showIntro && (
            <div className='post__intro'>
              <div className='intro__content'>
                <div className='intro__icon'>
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className='intro__text'>
                  <h2>제주도의 숨겨진 보석을 공유해주세요</h2>
                  <p>
                    당신만 아는 특별한 장소, 맛집, 카페를 다른 여행자들과
                    나눠보세요!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Tips Carousel */}
        <div className='post__tips-section'>
          <div className='section-toggle'>
            <button
              className='toggle-btn'
              onClick={toggleTips}
              aria-label={showTips ? '가이드 숨기기' : '가이드 보기'}
            >
              <FontAwesomeIcon icon={faLightbulb} />
              <span>등록 가이드</span>
              <FontAwesomeIcon icon={showTips ? faChevronUp : faChevronDown} />
            </button>
          </div>

          {showTips && (
            <div className='post__tips'>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className='tips__swiper'
              >
                {tips.map((tip, index) => (
                  <SwiperSlide key={index}>
                    <div className='tip__card'>
                      <div className='tip__icon'>
                        <FontAwesomeIcon icon={tip.icon} />
                      </div>
                      <h4 className='tip__title'>{tip.title}</h4>
                      <p className='tip__description'>{tip.description}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        <div className='post__form-container'>
          <PostForm userObj={userObj} />
        </div>
      </main>

      {/* 배경 클릭으로 프로필 드롭다운 닫기 */}
      {showProfile && (
        <div
          className='profile__backdrop'
          onClick={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default Post;
