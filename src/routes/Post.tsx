import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { authService } from '../fBase';
import type { UserObj } from '../types';

interface PostProps {
  userObj: UserObj | null;
}

const Post = ({ userObj }: PostProps) => {
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };

  const onHomeClick = () => {
    navigate('/');
  };

  return (
    <div className='post__container'>
      <br />
      <div>
        <button onClick={onHomeClick}>Home</button>
        <button onClick={onLogOutClick}>Logout</button>
      </div>
      <br />
      <PostForm userObj={userObj} />
    </div>
  );
};

export default Post;
