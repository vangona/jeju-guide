/**
 * 반응형 처리를 위한 커스텀 훅
 * User Agent 기반 감지를 대체하는 현대적 접근법
 */

import { useState, useEffect } from 'react';

// 브레이크포인트 정의
export const BREAKPOINTS = {
  mobile: 320,
  mobileLg: 480,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// 디바이스 타입 정의
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  hasTouch: boolean;
  isStandalone: boolean; // PWA 모드
}

/**
 * 현재 뷰포트 크기 기반으로 반응형 정보를 제공하는 훅
 */
export const useResponsive = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1024,
        height: 768,
        orientation: 'landscape',
        hasTouch: false,
        isStandalone: false,
      };
    }

    return getDeviceInfo();
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      // orientation change 후 약간의 지연을 두고 업데이트
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

/**
 * 특정 브레이크포인트에서의 매치 여부를 확인하는 훅
 */
export const useBreakpoint = (breakpoint: Breakpoint) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= BREAKPOINTS[breakpoint];
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    
    // 최신 브라우저
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // 구형 브라우저 지원
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [breakpoint]);

  return matches;
};

/**
 * CSS 미디어 쿼리와 연동되는 반응형 값 훅
 */
export const useResponsiveValue = <T>(values: {
  mobile?: T;
  mobileLg?: T;
  tablet?: T;
  desktop?: T;
  desktopLg?: T;
  default: T;
}) => {
  const { width } = useResponsive();

  if (width >= BREAKPOINTS.desktopLg && values.desktopLg !== undefined) {
    return values.desktopLg;
  }
  if (width >= BREAKPOINTS.desktop && values.desktop !== undefined) {
    return values.desktop;
  }
  if (width >= BREAKPOINTS.tablet && values.tablet !== undefined) {
    return values.tablet;
  }
  if (width >= BREAKPOINTS.mobileLg && values.mobileLg !== undefined) {
    return values.mobileLg;
  }
  if (width >= BREAKPOINTS.mobile && values.mobile !== undefined) {
    return values.mobile;
  }
  
  return values.default;
};

/**
 * 컨테이너 쿼리를 위한 훅 (실험적)
 */
export const useContainerQuery = (containerRef: React.RefObject<HTMLElement>) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return {
    containerWidth,
    isContainerMobile: containerWidth < BREAKPOINTS.tablet,
    isContainerTablet: containerWidth >= BREAKPOINTS.tablet && containerWidth < BREAKPOINTS.desktop,
    isContainerDesktop: containerWidth >= BREAKPOINTS.desktop,
  };
};

// 헬퍼 함수들
function getDeviceInfo(): DeviceInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    width,
    height,
    orientation: width > height ? 'landscape' : 'portrait',
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true,
  };
}

/**
 * 터치 디바이스 감지 (User Agent에 의존하지 않음)
 */
export const useTouch = () => {
  const [hasTouch, setHasTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    // 터치 이벤트 발생 시 확실히 터치 디바이스로 판단
    const handleTouchStart = () => {
      setHasTouch(true);
    };

    document.addEventListener('touchstart', handleTouchStart, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return hasTouch;
};

/**
 * 네트워크 상태 및 성능 최적화를 위한 훅
 */
export const useNetworkOptimization = () => {
  const [connectionInfo, setConnectionInfo] = useState(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return {
        effectiveType: '4g',
        saveData: false,
        downlink: 10,
      };
    }

    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType || '4g',
      saveData: connection.saveData || false,
      downlink: connection.downlink || 10,
    };
  });

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return;
    }

    const connection = (navigator as any).connection;
    
    const handleConnectionChange = () => {
      setConnectionInfo({
        effectiveType: connection.effectiveType || '4g',
        saveData: connection.saveData || false,
        downlink: connection.downlink || 10,
      });
    };

    connection.addEventListener('change', handleConnectionChange);

    return () => {
      connection.removeEventListener('change', handleConnectionChange);
    };
  }, []);

  return {
    ...connectionInfo,
    isSlowConnection: connectionInfo.effectiveType === 'slow-2g' || 
                     connectionInfo.effectiveType === '2g' ||
                     connectionInfo.saveData,
    shouldOptimizeImages: connectionInfo.saveData || 
                         connectionInfo.effectiveType === 'slow-2g' || 
                         connectionInfo.effectiveType === '2g',
  };
};