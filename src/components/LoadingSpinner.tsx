import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
  type?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner = ({
  size = 'medium',
  message = '로딩 중...',
  fullScreen = false,
  type = 'spinner',
}: LoadingSpinnerProps) => {
  const getContainerClass = () => {
    let baseClass = 'loading-spinner';
    baseClass += ` loading-spinner--${size}`;
    if (fullScreen) baseClass += ' loading-spinner--fullscreen';
    return baseClass;
  };

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <div className='loading-spinner__dots'>
            <div className='loading-spinner__dot'></div>
            <div className='loading-spinner__dot'></div>
            <div className='loading-spinner__dot'></div>
          </div>
        );
      case 'pulse':
        return <div className='loading-spinner__pulse'></div>;
      default:
        return <div className='loading-spinner__circle'></div>;
    }
  };

  return (
    <div className={getContainerClass()}>
      <div className='loading-spinner__container'>
        {renderSpinner()}
        {message && <p className='loading-spinner__message'>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
