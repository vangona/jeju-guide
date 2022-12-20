import React from 'react';
import { Link } from 'react-router-dom';

interface NavigationProps {
  handleViewTypeChange: (newViewType: string) => void;
  handleChatStateChange: (newChatState: boolean) => void;
}

const Navigation = ({
  handleViewTypeChange,
  handleChatStateChange,
}: NavigationProps) => {
  const onClickNav: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLDivElement; // e.target에 대한 타입 추론이 안되어서 HTMLDDivElement로 캐스팅함.
    if (target.innerHTML === 'Map') {
      handleViewTypeChange('지도');
      handleChatStateChange(false);
    } else if (target.innerHTML === 'List') {
      handleViewTypeChange('목록');
      handleChatStateChange(false);
    } else if (target.innerHTML === 'Chat') {
      handleChatStateChange(true);
    } else if (target.innerHTML === 'Profile') {
      handleViewTypeChange('프로필');
      handleChatStateChange(false);
    }
  };

  return (
    <div className='nav__container'>
      <div className='nav__component' onClick={onClickNav}>
        Map
      </div>
      <div className='nav__component' onClick={onClickNav}>
        List
      </div>
      <div className='nav__component' onClick={onClickNav}>
        Chat
      </div>
      <div className='nav__component' onClick={onClickNav}>
        Profile
      </div>
      <div className='nav__component'>
        <Link to='/tips'>Tips</Link>
      </div>
    </div>
  );
};

export default Navigation;
