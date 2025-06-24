import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faHome, 
  faLightbulb,
  faBus,
  faSuitcase,
  faWalking,
  faSun,
  faLeaf,
  faHeart,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram as faInstagramBrand, faFacebook as faFacebookBrand, faGithub as faGithubBrand } from '@fortawesome/free-brands-svg-icons';
import Navigation from '../components/Navigation';

const Tips = () => {
  const router = useRouter();

  const clickBackBtn = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  // Navigation handlers
  const handleViewTypeChange = (newViewType: string) => {
    if (newViewType === '지도' || newViewType === '목록') {
      router.push('/');
    }
  };

  // Enable scrolling for Tips page
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.classList.add('tips__page-active');
    
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.classList.remove('tips__page-active');
    };
  }, []);


  const tips = [
    {
      id: 1,
      icon: faBus,
      title: '제주 버스 정보 시스템',
      content: '제주도에는 실시간 버스 정보 시스템이 별도로 존재합니다. 뚜벅이라면 꼭 참고하세요!',
      link: 'http://bus.jeju.go.kr/',
      linkText: '버스 정보 시스템 바로가기'
    },
    {
      id: 2,
      icon: faSuitcase,
      title: '짐 옮기기 서비스',
      content: '공항에서 숙소, 숙소에서 숙소, 숙소에서 공항까지 짐을 옮겨주는 서비스가 잘 되어있습니다. 뚜벅이는 적극 이용해보세요.',
      category: '교통'
    },
    {
      id: 3,
      icon: faWalking,
      title: '올레길 추천',
      content: '제주도에서 제대로 걸어보고 싶다면 올레길을 적극 이용해보세요. 숨은 명소들을 발견할 수 있습니다.',
      category: '관광'
    },
    {
      id: 4,
      icon: faSun,
      title: '서쪽 노을 명소',
      content: '용눈이오름을 제외하고, 노을은 서쪽이 가장 아름답습니다. 해가 서쪽으로 지기 때문이겠죠?',
      category: '풍경'
    },
    {
      id: 5,
      icon: faLeaf,
      title: '최고의 계절은 가을',
      content: '로컬들이 뽑는 가장 좋은 제주도의 계절은 가을입니다. 사람도 적당히 없고, 정말 예뻐요.',
      category: '계절'
    },
    {
      id: 6,
      icon: faHeart,
      title: '정성이 담긴 서비스',
      content: '제주도는 어딘가에서 상처받은 사람이 많이 모입니다. 그렇기에 정성을 담은 서비스가 많아요. 당신만의 특별한 공간을 찾아보세요.',
      category: '문화'
    }
  ];

  const creators = [
    {
      name: '김관경',
      role: '장기여행자',
      description: ['제주도를 7개월간 여행', '뚜벅이 개발 담당'],
      social: [
        { platform: 'instagram', url: 'https://www.instagram.com/van_gona_/', icon: faInstagramBrand },
        { platform: 'facebook', url: 'https://www.facebook.com/gonavankim', icon: faFacebookBrand },
        { platform: 'github', url: 'https://github.com/vangona/', icon: faGithubBrand }
      ]
    },
    {
      name: '박태훈',
      role: '제주살이꾼',
      description: ['제주도에 5년간 거주', '제주도 숨은 맛집과 명소 탐방', 'SUPER DRIVER'],
      social: [
        { platform: 'instagram', url: 'https://www.instagram.com/van_gona_/', icon: faInstagramBrand }
      ]
    }
  ];

  return (
    <div className='tips__page'>
      {/* Background */}
      <div className='tips__background'>
        <div className='tips__wave'></div>
        <div className='tips__wave'></div>
        <div className='tips__wave'></div>
      </div>

      {/* Header */}
      <header className='tips__header'>
        <div className='tips__nav'>
          <button className='nav-btn nav-btn--back' onClick={clickBackBtn}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          
          <div className='tips__title-section'>
            <FontAwesomeIcon icon={faLightbulb} className='title-icon' />
            <h1 className='tips__title'>제주 여행 꿀팁</h1>
          </div>

          <button className='nav-btn nav-btn--home' onClick={goHome}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='tips__content'>
        <div className='tips__container'>
          {/* Intro Section */}
          <div className='tips__intro'>
            <h2>장기여행자가 들려주는 제주도 꿀팁</h2>
            <p>7개월간의 제주도 체험과 5년간의 거주 경험을 바탕으로 한 진짜 팁들을 만나보세요.</p>
          </div>

          {/* Tips Grid */}
          <div className='tips__grid'>
            {tips.map((tip) => (
              <div key={tip.id} className='tip__card'>
                <div className='tip__header'>
                  <div className='tip__icon'>
                    <FontAwesomeIcon icon={tip.icon} />
                  </div>
                  {tip.category && (
                    <span className='tip__category'>{tip.category}</span>
                  )}
                </div>
                <h3 className='tip__title'>{tip.title}</h3>
                <p className='tip__content'>{tip.content}</p>
                {tip.link && (
                  <a href={tip.link} target='_blank' rel='noreferrer' className='tip__link'>
                    <FontAwesomeIcon icon={faArrowLeft} style={{ transform: 'rotate(180deg)' }} />
                    {tip.linkText}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Creators Section */}
          <div className='creators__section'>
            <h2 className='section__title'>
              <FontAwesomeIcon icon={faUser} />
              만든 사람들
            </h2>
            
            <div className='creators__grid'>
              {creators.map((creator, index) => (
                <div key={index} className='creator__card'>
                  <div className='creator__info'>
                    <h3 className='creator__name'>{creator.name}</h3>
                    <span className='creator__role'>{creator.role}</span>
                    <ul className='creator__description'>
                      {creator.description.map((desc, i) => (
                        <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  </div>
                  <div className='creator__social'>
                    {creator.social.map((social, i) => (
                      <a 
                        key={i}
                        href={social.url} 
                        target='_blank' 
                        rel='noreferrer'
                        className='social__link'
                        title={social.platform}
                      >
                        <FontAwesomeIcon icon={social.icon} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credits Section */}
          <div className='credits__section'>
            <h3 className='section__title'>크레딧</h3>
            <div className='credits__list'>
              <p>Icons made by <a href='https://www.freepik.com' target='_blank' rel='noreferrer'>Freepik</a> from <a href='https://www.flaticon.com/' target='_blank' rel='noreferrer'>www.flaticon.com</a></p>
              <p>Icons made by iconixar from <a href='https://www.flaticon.com/' target='_blank' rel='noreferrer'>www.flaticon.com</a></p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='tips__footer'>
        <span className='copyright'>
          &copy; {new Date().getFullYear()}, 나만의 서랍장 Co. all rights reserved.
        </span>
      </footer>
      
      <Navigation 
        handleViewTypeChange={handleViewTypeChange}
      />
    </div>
  );
};

export default Tips;