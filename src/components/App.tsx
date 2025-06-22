import React, { useEffect, useState } from 'react';
import { authService } from '../fBase';
import { onAuthStateChanged } from 'firebase/auth';
import { UserObj } from '../types';
import AppRouter from './Router';
import LoadingSpinner from './LoadingSpinner';

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<UserObj | null>(null); // TODO: 서버 상태 관리 혹은 전역 상태 관리 적용하기
  const [isMobile, setIsMobile] = useState(false); // TODO: 전역 상태 관리 혹은 CSS로 적용하기
  const userAgent = navigator.userAgent;
  const checkIsMobile = () => {
    if (
      userAgent.match(
        /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i,
      ) != null ||
      userAgent.match(/LG|SAMSUNG|Samsung/) != null
    ) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
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
      checkIsMobile();
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          isMobile={isMobile}
        />
      ) : (
        <LoadingSpinner 
          fullScreen={true} 
          message="미슐탱 가이드를 준비하고 있습니다..." 
          size="large"
        />
      )}
    </>
  );
};

export default App;
