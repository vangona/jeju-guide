/**
 * 터치 및 제스처 최적화 유틸리티
 * 제주 가이드 앱의 모바일 인터랙션 향상
 */

import React from 'react';

export interface TouchGestureOptions {
  threshold?: number;
  velocity?: number;
  preventScroll?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: (event: TouchEvent) => void;
  onLongPress?: (event: TouchEvent) => void;
  onPullToRefresh?: () => void;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export class TouchGestureHandler {
  private element: HTMLElement;
  private options: TouchGestureOptions;
  private startPoint: TouchPoint | null = null;
  private endPoint: TouchPoint | null = null;
  private initialDistance: number = 0;
  private currentDistance: number = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private isPinching: boolean = false;
  private pullStartY: number = 0;
  private pullCurrentY: number = 0;
  private isPulling: boolean = false;

  constructor(element: HTMLElement, options: TouchGestureOptions = {}) {
    this.element = element;
    this.options = {
      threshold: 50,
      velocity: 0.3,
      preventScroll: false,
      ...options,
    };

    this.init();
  }

  private init() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
  }

  private handleTouchStart(event: TouchEvent) {
    const touches = event.touches;
    
    if (touches.length === 1) {
      // 단일 터치
      const touch = touches[0];
      this.startPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      // 긴 누르기 타이머 시작
      this.startLongPressTimer(event);

      // Pull-to-refresh 시작점 설정
      if (this.element.scrollTop === 0 && this.options.onPullToRefresh) {
        this.pullStartY = touch.clientY;
        this.isPulling = true;
      }
    } else if (touches.length === 2) {
      // 핀치 제스처
      this.isPinching = true;
      this.initialDistance = this.getDistance(touches[0], touches[1]);
      this.clearLongPressTimer();
    }

    if (this.options.preventScroll) {
      event.preventDefault();
    }
  }

  private handleTouchMove(event: TouchEvent) {
    const touches = event.touches;

    if (touches.length === 1 && this.startPoint) {
      const touch = touches[0];
      this.endPoint = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: Date.now(),
      };

      // 긴 누르기 타이머 취소 (움직임 감지)
      this.clearLongPressTimer();

      // Pull-to-refresh 처리
      if (this.isPulling && this.options.onPullToRefresh) {
        this.pullCurrentY = touch.clientY;
        const pullDistance = this.pullCurrentY - this.pullStartY;
        
        if (pullDistance > 80) { // 80px 이상 당기면 새로고침
          this.addPullToRefreshIndicator();
        }
      }

      // 스와이프 중 스크롤 방지 (필요시)
      if (this.options.preventScroll) {
        event.preventDefault();
      }
    } else if (touches.length === 2 && this.isPinching) {
      // 핀치 제스처 처리
      this.currentDistance = this.getDistance(touches[0], touches[1]);
      const scale = this.currentDistance / this.initialDistance;
      
      if (this.options.onPinch) {
        this.options.onPinch(scale);
      }

      event.preventDefault();
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    if (this.isPinching) {
      this.isPinching = false;
      return;
    }

    this.clearLongPressTimer();

    if (this.startPoint && this.endPoint) {
      const deltaX = this.endPoint.x - this.startPoint.x;
      const deltaY = this.endPoint.y - this.startPoint.y;
      const deltaTime = this.endPoint.timestamp - this.startPoint.timestamp;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / deltaTime;

      // Pull-to-refresh 완료 처리
      if (this.isPulling && this.options.onPullToRefresh) {
        const pullDistance = this.pullCurrentY - this.pullStartY;
        if (pullDistance > 80) {
          this.options.onPullToRefresh();
        }
        this.isPulling = false;
        this.removePullToRefreshIndicator();
      }

      // 스와이프 제스처 감지
      if (distance > (this.options.threshold || 50) && velocity > (this.options.velocity || 0.3)) {
        const angle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI;
        
        if (angle < 45) {
          // 수평 스와이프
          if (deltaX > 0) {
            this.options.onSwipeRight?.();
          } else {
            this.options.onSwipeLeft?.();
          }
        } else {
          // 수직 스와이프
          if (deltaY > 0) {
            this.options.onSwipeDown?.();
          } else {
            this.options.onSwipeUp?.();
          }
        }
      } else if (distance < 10 && deltaTime < 300) {
        // 탭 제스처
        this.options.onTap?.(event);
      }
    }

    this.startPoint = null;
    this.endPoint = null;
  }

  private handleTouchCancel() {
    this.clearLongPressTimer();
    this.startPoint = null;
    this.endPoint = null;
    this.isPinching = false;
    this.isPulling = false;
  }

  private startLongPressTimer(event: TouchEvent) {
    this.longPressTimer = setTimeout(() => {
      if (this.options.onLongPress) {
        this.options.onLongPress(event);
      }
    }, 800); // 800ms 긴 누르기
  }

  private clearLongPressTimer() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private addPullToRefreshIndicator() {
    let indicator = this.element.querySelector('.pull-to-refresh-indicator') as HTMLElement;
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pull-to-refresh-indicator';
      indicator.innerHTML = '↓ 새로고침';
      indicator.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        padding: 8px 16px;
        background: rgba(158, 186, 208, 0.9);
        color: white;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        transition: all 0.2s ease;
      `;
      this.element.appendChild(indicator);
    }
    indicator.style.top = '10px';
    indicator.innerHTML = '↑ 놓으면 새로고침';
  }

  private removePullToRefreshIndicator() {
    const indicator = this.element.querySelector('.pull-to-refresh-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  public destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    this.clearLongPressTimer();
  }
}

// React Hook으로 터치 제스처 사용
export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options: TouchGestureOptions
) => {
  React.useEffect(() => {
    if (!elementRef.current) return;

    const gestureHandler = new TouchGestureHandler(elementRef.current, options);

    return () => {
      gestureHandler.destroy();
    };
  }, [elementRef, options]);
};

// 터치 최적화 유틸리티 함수들
export const touchUtils = {
  /**
   * 터치 타겟 크기가 충분한지 확인
   */
  validateTouchTarget: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },

  /**
   * 터치 이벤트에서 좌표 추출
   */
  getTouchCoordinates: (event: TouchEvent) => {
    const touch = event.touches[0] || event.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
    };
  },

  /**
   * 햅틱 피드백 (지원되는 경우)
   */
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100],
      };
      navigator.vibrate(patterns[type]);
    }
  },

  /**
   * 터치 디바이스인지 확인
   */
  isTouchDevice: (): boolean => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  },

  /**
   * 스와이프 가능한 컨테이너에 스크롤 스냅 적용
   */
  enableScrollSnap: (element: HTMLElement, direction: 'x' | 'y' = 'x') => {
    element.style.scrollSnapType = `${direction} mandatory`;
    element.style.scrollBehavior = 'smooth';
    
    const children = Array.from(element.children) as HTMLElement[];
    children.forEach(child => {
      child.style.scrollSnapAlign = 'start';
    });
  },

  /**
   * iOS Safari에서 바운스 스크롤 비활성화
   */
  disableBounceScroll: (element: HTMLElement) => {
    element.style.overscrollBehavior = 'none';
    // @ts-ignore - webkit 전용 속성
    element.style.webkitOverflowScrolling = 'touch';
  },

  /**
   * 터치 지연 제거 (300ms 지연)
   */
  removeTouchDelay: (element: HTMLElement) => {
    element.style.touchAction = 'manipulation';
  },
};

// 관광 앱 특화 제스처 프리셋
export const touristAppGestures = {
  /**
   * 지도 제스처 설정
   */
  mapGestures: (mapElement: HTMLElement, callbacks: {
    onPinchZoom?: (scale: number) => void;
    onPanMove?: (deltaX: number, deltaY: number) => void;
    onDoubleTap?: () => void;
  }) => {
    return new TouchGestureHandler(mapElement, {
      onPinch: callbacks.onPinchZoom,
      onTap: (event) => {
        // 더블 탭 감지 로직 추가 가능
        callbacks.onDoubleTap?.();
      },
      preventScroll: true,
    });
  },

  /**
   * 이미지 갤러리 제스처
   */
  galleryGestures: (galleryElement: HTMLElement, callbacks: {
    onSwipeNext?: () => void;
    onSwipePrev?: () => void;
    onPinchZoom?: (scale: number) => void;
  }) => {
    return new TouchGestureHandler(galleryElement, {
      onSwipeLeft: callbacks.onSwipeNext,
      onSwipeRight: callbacks.onSwipePrev,
      onPinch: callbacks.onPinchZoom,
      threshold: 30,
      velocity: 0.2,
    });
  },

  /**
   * 리스트 아이템 제스처 (스와이프 액션)
   */
  listItemGestures: (itemElement: HTMLElement, callbacks: {
    onSwipeDelete?: () => void;
    onSwipeFavorite?: () => void;
    onLongPressMenu?: () => void;
  }) => {
    return new TouchGestureHandler(itemElement, {
      onSwipeLeft: callbacks.onSwipeDelete,
      onSwipeRight: callbacks.onSwipeFavorite,
      onLongPress: callbacks.onLongPressMenu,
      threshold: 80,
    });
  },
};