import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  size = 'medium',
  message = '로딩 중...',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const getSpinnerClass = () => {
    let baseClass = 'loading-spinner';
    baseClass += ` loading-spinner--${size}`;
    if (fullScreen) baseClass += ' loading-spinner--fullscreen';
    return baseClass;
  };

  return (
    <div className={getSpinnerClass()}>
      <div className='loading-spinner__container'>
        <div className='loading-spinner__circle'>
          <div className='loading-spinner__wave'></div>
          <div className='loading-spinner__wave'></div>
          <div className='loading-spinner__wave'></div>
        </div>
        {message && <p className='loading-spinner__message'>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
