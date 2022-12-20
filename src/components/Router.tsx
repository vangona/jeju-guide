import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'; // TODO: Rotuer 방식 변경하기
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
    <>
      <Router>
        <Switch>
          {isLoggedIn ? (
            <Route exact path='/post'>
              <Post userObj={userObj} />
            </Route>
          ) : (
            <Route exact path='/post'>
              <Auth />
            </Route>
          )}
          {isLoggedIn ? (
            <Route exact path='/edit'>
              <Edit />
            </Route>
          ) : (
            <Route exact path='/edit'>
              <Auth />
            </Route>
          )}
          <Route exact path='/'>
            <Home isMobile={isMobile} userObj={userObj} />
          </Route>
          <Route exact path='/detail' component={Detail} />
          <Route exact path='/detail/:place' component={Detail} />
          <Route exact path='/tips'>
            <Tips />
          </Route>
          {/* <Route exact path="/myplace">
                        <MyPlace />
                    </Route> */}
        </Switch>
      </Router>
    </>
  );
};

export default AppRouter;
