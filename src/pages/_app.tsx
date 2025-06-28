import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '../fBase';
import type { UserObj } from '../types';
import Head from 'next/head';
import '../styles.css';
import '../styles/components.css';
import '../styles/responsive.css';
import '../styles/touch-optimization.css';
import '../styles/mobile-optimizations.css';

function MyApp({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<UserObj | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });

    // 모바일 기기 감지
    const checkMobile = () => {
      const userAgent = window.navigator.userAgent;
      const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      setIsMobile(mobile || window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
      </Head>
      {init ? (
        <Component
          {...pageProps}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          isMobile={isMobile}
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

export default MyApp;
