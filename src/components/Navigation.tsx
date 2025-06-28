import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faList,
  faLightbulb,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';

interface NavigationProps {
  handleViewTypeChange: (newViewType: string) => void;
}

const Navigation = ({ handleViewTypeChange }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('지도');
  const router = useRouter();

  // 현재 경로에 따라 activeTab 설정
  useEffect(() => {
    switch (router.pathname) {
      case '/':
        // 홈페이지에서는 query string에서 뷰 타입 가져오기
        const viewFromQuery = (router.query.view as string) || '지도';
        setActiveTab(viewFromQuery);
        break;
      case '/myplace':
        setActiveTab('myplace');
        break;
      case '/tips':
        setActiveTab('tips');
        break;
      default:
        setActiveTab('지도');
        break;
    }
  }, [router.pathname, router.query.view]);

  const handleNavClick = (type: string) => {
    setActiveTab(type);

    // 홈페이지가 아닌 경우 query string과 함께 홈으로 이동
    if (router.pathname !== '/') {
      router.push({
        pathname: '/',
        query: { view: type }
      });
    } else {
      // 홈페이지인 경우 뷰 타입만 변경
      handleViewTypeChange(type);
    }
  };

  const navItems = [
    { key: '지도', label: 'Map', icon: faMap },
    { key: '목록', label: 'List', icon: faList },
  ];

  return (
    <nav className='nav__container'>
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav__component ${activeTab === item.key ? 'nav__component--active' : ''}`}
          onClick={() => handleNavClick(item.key)}
          aria-label={item.label}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span className='nav__label'>{item.label}</span>
        </button>
      ))}
      <Link 
        href='/myplace' 
        className={`nav__component nav__component--link ${activeTab === 'myplace' ? 'nav__component--active' : ''}`}
      >
        <FontAwesomeIcon icon={faHeart} />
        <span className='nav__label'>My</span>
      </Link>
      <Link 
        href='/tips' 
        className={`nav__component nav__component--link ${activeTab === 'tips' ? 'nav__component--active' : ''}`}
      >
        <FontAwesomeIcon icon={faLightbulb} />
        <span className='nav__label'>Tips</span>
      </Link>
    </nav>
  );
};

export default Navigation;
