import React from 'react';
import { cx } from '../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  disabled,
  children,
  ...props
}) => {
  return (
    <button
      className={cx(
        // 기본 스타일
        'inline-flex items-center justify-center font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        
        // 변형(variant) 스타일
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500': variant === 'secondary',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500': variant === 'outline',
          'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
        },
        
        // 크기 스타일
        {
          'px-3 py-1.5 text-sm rounded': size === 'sm',
          'px-4 py-2 text-base rounded-md': size === 'md',
          'px-6 py-3 text-lg rounded-lg': size === 'lg',
        },
        
        // 로딩 상태
        {
          'cursor-wait': loading,
        },
        
        // 외부에서 전달된 클래스
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 mr-2 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;