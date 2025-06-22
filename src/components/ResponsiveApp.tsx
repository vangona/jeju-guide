/**
 * 개선된 App 컴포넌트 - 반응형 처리 예시
 * User Agent 기반 감지를 CSS 기반 반응형으로 대체
 */

import React, { useEffect, useState } from 'react';
import { authService } from '../fBase';
import { onAuthStateChanged } from 'firebase/auth';
import { UserObj } from '../types';
import { useResponsive, useTouch, useNetworkOptimization } from '../hooks/useResponsive';
import AppRouter from './Router';

const ResponsiveApp = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<UserObj | null>(null);
  
  // 현대적 반응형 처리
  const deviceInfo = useResponsive();
  const hasTouch = useTouch();
  const networkInfo = useNetworkOptimization();

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setUserObj({
          uid: user.uid,
          displayName: user.displayName ? user.displayName : '',
          photoURL: user.photoURL ? user.photoURL : '',
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  // 성능 최적화를 위한 로딩 컴포넌트
  const LoadingComponent = () => (
    <div className="app-loading">
      <div className="loading-spinner"></div>
      <p>제주 가이드를 불러오는 중...</p>
    </div>
  );

  return (
    <div 
      className={`app-container ${deviceInfo.isMobile ? 'mobile' : ''} ${deviceInfo.isTablet ? 'tablet' : ''} ${deviceInfo.isDesktop ? 'desktop' : ''}`}
      data-has-touch={hasTouch}
      data-orientation={deviceInfo.orientation}
      data-slow-connection={networkInfo.isSlowConnection}
    >
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          deviceInfo={deviceInfo}
          hasTouch={hasTouch}
          networkInfo={networkInfo}
        />
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default ResponsiveApp;