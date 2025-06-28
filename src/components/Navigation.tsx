import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMap,
  faList,
  faLightbulb,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';

interface NavigationProps {
  handleViewTypeChange: (newViewType: string) => void;
}

const Navigation = ({ handleViewTypeChange }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('지도');

  const handleNavClick = (type: string) => {
    setActiveTab(type);

    switch (type) {
      case '지도':
        handleViewTypeChange('지도');
        break;
      case '목록':
        handleViewTypeChange('목록');
        break;
    }
  };

  const navItems = [
    { key: '지도', label: 'Map', icon: faMap },
    { key: '목록', label: 'List', icon: faList },
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
      <Link href='/myplace' className='nav__component nav__component--link'>
        <FontAwesomeIcon icon={faHeart} />
        <span className='nav__label'>My</span>
      </Link>
      <Link href='/tips' className='nav__component nav__component--link'>
        <FontAwesomeIcon icon={faLightbulb} />
        <span className='nav__label'>Tips</span>
      </Link>
    </nav>
  );
};

export default Navigation;
