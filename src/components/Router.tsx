import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '../routes/Auth';
import Detail from '../routes/Detail';
import Edit from '../routes/Edit';
import Home from '../routes/Home';
import Post from '../routes/Post';
import Tips from '../routes/Tips';
import { UserObj } from '../types';

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: UserObj | null;
  isMobile: boolean;
}

const AppRouter = ({ isLoggedIn, userObj, isMobile }: AppRouterProps) => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home isMobile={isMobile} userObj={userObj} />} />
        <Route 
          path='/post' 
          element={isLoggedIn ? <Post userObj={userObj} /> : <Navigate to='/auth' replace />} 
        />
        <Route 
          path='/edit' 
          element={isLoggedIn ? <Edit /> : <Navigate to='/auth' replace />} 
        />
        <Route path='/detail' element={<Detail />} />
        <Route path='/detail/:place' element={<Detail />} />
        <Route path='/tips' element={<Tips />} />
        <Route path='/auth' element={<Auth />} />
        {/* <Route path="/myplace" element={<MyPlace />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
