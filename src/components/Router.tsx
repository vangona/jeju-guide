import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '../routes/Auth';
import Detail from '../routes/Detail';
import Edit from '../routes/Edit';
import Home from '../routes/Home';
import Post from '../routes/Post';
import Tips from '../routes/Tips';
import MyPlace from '../routes/MyPlace';
import { UserObj } from '../types';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

interface NetworkInfo {
  isSlowConnection: boolean;
  shouldOptimizeImages: boolean;
  effectiveType: string;
  saveData: boolean;
  downlink: number;
}

interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: UserObj | null;
  isMobile?: boolean; // 레거시 지원
  deviceInfo?: DeviceInfo;
  hasTouch?: boolean;
  networkInfo?: NetworkInfo;
}

const AppRouter = ({ 
  isLoggedIn, 
  userObj, 
  isMobile, 
  deviceInfo, 
  hasTouch, 
  networkInfo 
}: AppRouterProps) => {
  // 레거시 지원: isMobile이 있으면 사용, 없으면 deviceInfo에서 추출
  const mobile = isMobile ?? deviceInfo?.isMobile ?? false;
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home isMobile={mobile} userObj={userObj} />} />
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
        <Route path="/myplace" element={<MyPlace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
