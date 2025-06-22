/**
 * 성능 최적화 유틸리티
 * 모바일 환경과 느린 네트워크를 고려한 최적화 전략
 */

import React from 'react';

// 이미지 최적화 관련 타입
export interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
  placeholder?: string;
}

export interface AdaptiveLoadingConfig {
  effectiveType: string;
  saveData: boolean;
  downlink: number;
}

// 네트워크 상태에 따른 설정
export const networkConfigs = {
  'slow-2g': {
    imageQuality: 40,
    maxImageSize: 300,
    enableLazyLoading: true,
    preloadImages: false,
    chunkSize: 'small',
  },
  '2g': {
    imageQuality: 50,
    maxImageSize: 400,
    enableLazyLoading: true,
    preloadImages: false,
    chunkSize: 'small',
  },
  '3g': {
    imageQuality: 70,
    maxImageSize: 600,
    enableLazyLoading: true,
    preloadImages: true,
    chunkSize: 'medium',
  },
  '4g': {
    imageQuality: 85,
    maxImageSize: 800,
    enableLazyLoading: false,
    preloadImages: true,
    chunkSize: 'large',
  },
};

/**
 * 네트워크 상태 기반 적응형 로딩 관리자
 */
export class AdaptiveLoadingManager {
  private config: AdaptiveLoadingConfig;
  private networkConfig: any;

  constructor() {
    this.config = this.getNetworkInfo();
    this.networkConfig = networkConfigs[this.config.effectiveType as keyof typeof networkConfigs] || networkConfigs['4g'];
    this.setupNetworkChangeListener();
  }

  private getNetworkInfo(): AdaptiveLoadingConfig {
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
  }

  private setupNetworkChangeListener() {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.config = this.getNetworkInfo();
        this.networkConfig = networkConfigs[this.config.effectiveType as keyof typeof networkConfigs] || networkConfigs['4g'];
      });
    }
  }

  /**
   * 이미지 최적화 옵션 반환
   */
  getImageOptimization(): ImageOptimizationOptions {
    return {
      quality: this.networkConfig.imageQuality,
      maxWidth: this.networkConfig.maxImageSize,
      maxHeight: this.networkConfig.maxImageSize,
      format: this.config.saveData ? 'jpeg' : 'webp',
      lazy: this.networkConfig.enableLazyLoading,
    };
  }

  /**
   * 느린 연결 여부 확인
   */
  isSlowConnection(): boolean {
    return (
      this.config.effectiveType === 'slow-2g' ||
      this.config.effectiveType === '2g' ||
      this.config.saveData ||
      this.config.downlink < 1.5
    );
  }

  /**
   * 데이터 절약 모드 여부
   */
  isDataSaveMode(): boolean {
    return this.config.saveData;
  }

  /**
   * 청크 크기 반환
   */
  getChunkSize(): 'small' | 'medium' | 'large' {
    return this.networkConfig.chunkSize;
  }
}

/**
 * 이미지 최적화 클래스
 */
export class ImageOptimizer {
  private adaptiveLoader: AdaptiveLoadingManager;
  private intersectionObserver?: IntersectionObserver;
  private loadedImages = new Set<string>();

  constructor() {
    this.adaptiveLoader = new AdaptiveLoadingManager();
    this.setupLazyLoading();
  }

  /**
   * 지연 로딩 설정
   */
  private setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.intersectionObserver?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );
    }
  }

  /**
   * 이미지 최적화 및 로딩
   */
  async optimizeAndLoad(
    src: string,
    options: ImageOptimizationOptions = {}
  ): Promise<string> {
    const optimizationOptions = {
      ...this.adaptiveLoader.getImageOptimization(),
      ...options,
    };

    // 이미 로드된 이미지는 캐시된 버전 반환
    const cacheKey = `${src}_${JSON.stringify(optimizationOptions)}`;
    if (this.loadedImages.has(cacheKey)) {
      return src;
    }

    // 네트워크 상태에 따른 이미지 URL 생성
    const optimizedSrc = this.generateOptimizedUrl(src, optimizationOptions);

    // 프리로드 (필요한 경우)
    if (!this.adaptiveLoader.isSlowConnection()) {
      this.preloadImage(optimizedSrc);
    }

    this.loadedImages.add(cacheKey);
    return optimizedSrc;
  }

  /**
   * 최적화된 이미지 URL 생성
   */
  private generateOptimizedUrl(
    src: string,
    options: ImageOptimizationOptions
  ): string {
    // 실제 이미지 최적화 서비스 URL 생성
    // 예: Cloudinary, ImageKit 등의 서비스 활용
    const params = new URLSearchParams();
    
    if (options.quality) {
      params.append('q', options.quality.toString());
    }
    
    if (options.maxWidth) {
      params.append('w', options.maxWidth.toString());
    }
    
    if (options.maxHeight) {
      params.append('h', options.maxHeight.toString());
    }
    
    if (options.format) {
      params.append('f', options.format);
    }

    // 실제 환경에서는 CDN URL 사용
    return `${src}?${params.toString()}`;
  }

  /**
   * 이미지 프리로드
   */
  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * 지연 로딩 이미지 등록
   */
  observeImage(img: HTMLImageElement) {
    if (this.intersectionObserver && img.dataset.src) {
      this.intersectionObserver.observe(img);
    }
  }

  /**
   * 이미지 로딩
   */
  private loadImage(img: HTMLImageElement) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    }
  }
}

/**
 * 가상화 (Virtualization) 유틸리티
 */
export class VirtualizationManager {
  private container: HTMLElement;
  private items: any[];
  private itemHeight: number;
  private visibleCount: number;
  private scrollTop: number = 0;
  private startIndex: number = 0;
  private endIndex: number = 0;

  constructor(
    container: HTMLElement,
    items: any[],
    itemHeight: number = 100
  ) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.setupScrollListener();
    this.updateVisibleItems();
  }

  private setupScrollListener() {
    this.container.addEventListener('scroll', () => {
      this.scrollTop = this.container.scrollTop;
      this.updateVisibleItems();
    });
  }

  private updateVisibleItems() {
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight);
    this.endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );

    this.render();
  }

  private render() {
    // Virtual scrolling 구현
    const totalHeight = this.items.length * this.itemHeight;
    const offsetY = this.startIndex * this.itemHeight;

    this.container.style.height = `${totalHeight}px`;
    this.container.style.paddingTop = `${offsetY}px`;

    // 실제 DOM 업데이트는 React 컴포넌트에서 처리
    this.onVisibleItemsChange?.(
      this.items.slice(this.startIndex, this.endIndex),
      this.startIndex
    );
  }

  onVisibleItemsChange?: (visibleItems: any[], startIndex: number) => void;

  updateItems(newItems: any[]) {
    this.items = newItems;
    this.updateVisibleItems();
  }
}

/**
 * 캐싱 관리자
 */
export class CacheManager {
  private cache = new Map<string, any>();
  private maxSize: number;
  private currentSize: number = 0;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  set(key: string, value: any, ttl?: number) {
    if (this.currentSize >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        this.currentSize--;
      }
    }

    const entry = {
      value,
      timestamp: Date.now(),
      ttl: ttl ? Date.now() + ttl : null,
    };

    this.cache.set(key, entry);
    this.currentSize++;
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (entry.ttl && Date.now() > entry.ttl) {
      this.cache.delete(key);
      this.currentSize--;
      return null;
    }

    return entry.value;
  }

  clear() {
    this.cache.clear();
    this.currentSize = 0;
  }

  size() {
    return this.currentSize;
  }
}

/**
 * 디바운스 및 쓰로틀링 유틸리티
 */
export const performanceUtils = {
  /**
   * 디바운스 함수
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * 쓰로틀링 함수
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * RequestAnimationFrame 기반 쓰로틀링
   */
  rafThrottle<T extends (...args: any[]) => any>(
    func: T
  ): (...args: Parameters<T>) => void {
    let rafId: number;
    return (...args: Parameters<T>) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => func(...args));
    };
  },

  /**
   * 지연 실행 (Defer)
   */
  defer(func: () => void) {
    setTimeout(func, 0);
  },

  /**
   * 다음 틱에 실행
   */
  nextTick(func: () => void) {
    if (typeof process !== 'undefined' && process.nextTick) {
      process.nextTick(func);
    } else {
      setTimeout(func, 0);
    }
  },
};

/**
 * Bundle splitting을 위한 동적 import 관리자
 */
export class DynamicImportManager {
  private loadingModules = new Map<string, Promise<any>>();
  private loadedModules = new Map<string, any>();

  async loadModule(modulePath: string): Promise<any> {
    // 이미 로드된 모듈 반환
    if (this.loadedModules.has(modulePath)) {
      return this.loadedModules.get(modulePath);
    }

    // 로딩 중인 모듈 대기
    if (this.loadingModules.has(modulePath)) {
      return this.loadingModules.get(modulePath);
    }

    // 새 모듈 로딩 시작
    const loadingPromise = import(modulePath)
      .then((module) => {
        this.loadedModules.set(modulePath, module);
        this.loadingModules.delete(modulePath);
        return module;
      })
      .catch((error) => {
        this.loadingModules.delete(modulePath);
        throw error;
      });

    this.loadingModules.set(modulePath, loadingPromise);
    return loadingPromise;
  }

  preloadModule(modulePath: string): void {
    this.loadModule(modulePath).catch(() => {
      // 프리로드 실패는 조용히 처리
    });
  }
}

// 싱글톤 인스턴스들
export const adaptiveLoader = new AdaptiveLoadingManager();
export const imageOptimizer = new ImageOptimizer();
export const cacheManager = new CacheManager();
export const dynamicImporter = new DynamicImportManager();

// React Hook으로 성능 최적화 제공
export const usePerformanceOptimization = () => {
  const [networkInfo, setNetworkInfo] = React.useState(() => 
    adaptiveLoader.isSlowConnection()
  );

  React.useEffect(() => {
    // 네트워크 상태 변경 감지
    const updateNetworkInfo = () => {
      setNetworkInfo(adaptiveLoader.isSlowConnection());
    };

    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  return {
    isSlowConnection: networkInfo,
    isDataSaveMode: adaptiveLoader.isDataSaveMode(),
    getImageOptimization: () => adaptiveLoader.getImageOptimization(),
    optimizeImage: (src: string, options?: ImageOptimizationOptions) =>
      imageOptimizer.optimizeAndLoad(src, options),
  };
};