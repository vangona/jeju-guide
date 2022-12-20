import React from 'react';
import { UserObj } from '../types';

interface ProfileProps {
  userObj: UserObj | null;
}

const Profile = ({ userObj }: ProfileProps) => {
  return (
    <div className='profile__container'>
      <div>
        <h1>프로필 화면</h1>
      </div>
      <div>{userObj?.uid}</div>
    </div>
  );
};

export default Profile;
