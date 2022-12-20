import React from 'react';
import { useHistory } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { authService } from '../fBase';
import type { UserObj } from '../types';

interface PostProps {
  userObj: UserObj;
}

const Post = ({ userObj }: PostProps) => {
  const history = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const onHomeClick = () => {
    history.push('/');
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
