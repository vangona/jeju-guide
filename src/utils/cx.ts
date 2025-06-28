import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * className 합성 유틸리티
 * clsx와 tailwind-merge를 결합하여 Tailwind CSS 클래스의 중복을 해결하고 조건부 클래스를 깔끔하게 처리
 * 
 * @example
 * cx('px-2 py-1', 'px-4', condition && 'text-red-500', { 'bg-blue-500': isActive })
 * // 결과: 'px-4 py-1 text-red-500 bg-blue-500' (px-2는 px-4로 오버라이드됨)
 */

/**
 * 클래스명을 합성하고 Tailwind CSS 충돌을 해결하는 유틸리티 함수
 * 
 * @param inputs - 클래스명, 조건부 클래스, 객체 등
 * @returns 합성되고 최적화된 클래스명 문자열
 */
export function cx(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

/**
 * 조건부 클래스명을 위한 헬퍼 함수
 * 
 * @param condition - 조건
 * @param className - 조건이 true일 때 적용할 클래스명
 * @param elseClassName - 조건이 false일 때 적용할 클래스명 (선택사항)
 * @returns 조건에 따른 클래스명
 */
export function when(
  condition: boolean | undefined | null,
  className: string,
  elseClassName?: string
): string {
  return condition ? className : (elseClassName || '');
}

/**
 * 여러 변형(variant) 중 하나를 선택하는 헬퍼 함수
 * 
 * @param variants - 변형 객체
 * @param defaultVariant - 기본 변형
 * @returns 선택된 변형의 클래스명
 */
export function variant<T extends Record<string, string>>(
  variants: T,
  selected: keyof T,
  defaultVariant?: keyof T
): string {
  return variants[selected] || (defaultVariant ? variants[defaultVariant] : '');
}

// 기본 내보내기
export default cx;