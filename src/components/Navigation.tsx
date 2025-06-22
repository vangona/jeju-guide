import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMap, 
  faList, 
  faComments, 
  faUser, 
  faLightbulb 
} from '@fortawesome/free-solid-svg-icons';

interface NavigationProps {
  handleViewTypeChange: (newViewType: string) => void;
  handleChatStateChange: (newChatState: boolean) => void;
}

const Navigation = ({
  handleViewTypeChange,
  handleChatStateChange,
}: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('지도');

  const handleNavClick = (type: string) => {
    setActiveTab(type);
    
    switch (type) {
      case '지도':
        handleViewTypeChange('지도');
        handleChatStateChange(false);
        break;
      case '목록':
        handleViewTypeChange('목록');
        handleChatStateChange(false);
        break;
      case '채팅':
        handleChatStateChange(true);
        break;
      case '프로필':
        handleViewTypeChange('프로필');
        handleChatStateChange(false);
        break;
    }
  };

  const navItems = [
    { key: '지도', label: 'Map', icon: faMap },
    { key: '목록', label: 'List', icon: faList },
    { key: '채팅', label: 'Chat', icon: faComments },
    { key: '프로필', label: 'Profile', icon: faUser },
  ];

  return (
    <nav className='nav__container'>
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav__component ${activeTab === item.key ? 'nav__component--active' : ''}`}
          onClick={() => handleNavClick(item.key)}
          aria-label={item.label}
        >
          <FontAwesomeIcon icon={item.icon} />
          <span className='nav__label'>{item.label}</span>
        </button>
      ))}
      <Link to='/tips' className='nav__component nav__component--link'>
        <FontAwesomeIcon icon={faLightbulb} />
        <span className='nav__label'>Tips</span>
      </Link>
    </nav>
  );
};

export default Navigation;
