/**
 * 반응형 내비게이션 컴포넌트
 * 모바일: 하단 탭 바, 데스크톱: 상단 또는 사이드 내비게이션
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faList,
  faPlus,
  faHome,
  faLightbulb,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveNavigationProps {
  handleViewTypeChange: (viewType: string) => void;
  isLoggedIn?: boolean;
}

const ResponsiveNavigation = ({
  handleViewTypeChange,
  isLoggedIn = false,
}: ResponsiveNavigationProps) => {
  const location = useLocation();
  const deviceInfo = useResponsive();

  // 내비게이션 아이템 정의
  const navigationItems = [
    {
      id: 'home',
      label: '홈',
      icon: faHome,
      onClick: () => handleViewTypeChange('지도'),
      isActive: location.pathname === '/',
      showAlways: true,
    },
    {
      id: 'map',
      label: '지도',
      icon: faMap,
      onClick: () => handleViewTypeChange('지도'),
      isActive:
        location.pathname === '/' && location.search.includes('view=map'),
      showAlways: true,
    },
    {
      id: 'list',
      label: '목록',
      icon: faList,
      onClick: () => handleViewTypeChange('목록'),
      isActive:
        location.pathname === '/' && location.search.includes('view=list'),
      showAlways: true,
    },
    {
      id: 'myplace',
      label: '내 장소',
      icon: faHeart,
      link: '/myplace',
      isActive: location.pathname === '/myplace',
      showAlways: true,
    },
    {
      id: 'tips',
      label: '팁',
      icon: faLightbulb,
      link: '/tips',
      isActive: location.pathname === '/tips',
      showAlways: true,
    },
    {
      id: 'add',
      label: '추가',
      icon: faPlus,
      link: '/post',
      isActive: location.pathname === '/post',
      showAlways: false,
      requiresAuth: true,
    },
  ];

  // 표시할 아이템 필터링
  const getVisibleItems = () => {
    return navigationItems.filter((item) => {
      if (item.requiresAuth && !isLoggedIn) return false;
      return item.showAlways || deviceInfo.isMobile;
    });
  };

  const visibleItems = getVisibleItems();

  // 모바일 네비게이션 렌더링
  const renderMobileNavigation = () => (
    <nav
      className='nav-responsive mobile-navigation'
      role='navigation'
      aria-label='주요 내비게이션'
    >
      <div className='nav-items'>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
          >
            {item.link ? (
              <Link
                to={item.link}
                className='nav-link touch-target'
                aria-label={item.label}
              >
                <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                <span className='nav-label'>{item.label}</span>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className='nav-button touch-target'
                aria-label={item.label}
                type='button'
              >
                <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                <span className='nav-label'>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );

  // 데스크톱 네비게이션 렌더링
  const renderDesktopNavigation = () => (
    <nav
      className='desktop-navigation'
      role='navigation'
      aria-label='주요 내비게이션'
    >
      <div className='nav-brand'>
        <Link to='/' className='brand-link'>
          <h1>제주 가이드</h1>
        </Link>
      </div>

      <div className='nav-items'>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${item.isActive ? 'active' : ''}`}
          >
            {item.link ? (
              <Link to={item.link} className='nav-link' aria-label={item.label}>
                <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                <span className='nav-label'>{item.label}</span>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className='nav-button'
                aria-label={item.label}
                type='button'
              >
                <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                <span className='nav-label'>{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );

  // 태블릿 네비게이션 렌더링
  const renderTabletNavigation = () => (
    <nav
      className='tablet-navigation'
      role='navigation'
      aria-label='주요 내비게이션'
    >
      <div className='nav-container'>
        <div className='nav-brand'>
          <Link to='/' className='brand-link'>
            제주 가이드
          </Link>
        </div>

        <div className='nav-items'>
          {visibleItems.slice(0, 6).map(
            (
              item, // 태블릿에서는 최대 6개 아이템
            ) => (
              <div
                key={item.id}
                className={`nav-item ${item.isActive ? 'active' : ''}`}
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className='nav-link'
                    aria-label={item.label}
                  >
                    <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                    {!deviceInfo.isMobile && (
                      <span className='nav-label'>{item.label}</span>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className='nav-button'
                    aria-label={item.label}
                    type='button'
                  >
                    <FontAwesomeIcon icon={item.icon} className='nav-icon' />
                    {!deviceInfo.isMobile && (
                      <span className='nav-label'>{item.label}</span>
                    )}
                  </button>
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </nav>
  );

  // 디바이스 타입에 따른 네비게이션 렌더링
  if (deviceInfo.isMobile) {
    return renderMobileNavigation();
  }

  if (deviceInfo.isTablet) {
    return renderTabletNavigation();
  }

  return renderDesktopNavigation();
};

export default ResponsiveNavigation;
