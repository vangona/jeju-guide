import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "routes/Auth";
import Detail from "routes/Detail";
import Edit from "routes/Edit";
import Home from "routes/Home";
import MyPlace from "routes/MyPlace";
import Post from "routes/Post";
import Profile from "routes/Profile";
import Test from "routes/Test";
import Tips from "routes/Tips";

const AppRouter = ({ isLoggedIn, userObj, isMobile }) => {

    return (
        <>
            <Router>
                <Switch>
                    {isLoggedIn 
                        ? (             
                            <Route exact path="/post">
                                <Post userObj={userObj}/>
                            </Route>
                        ) : (    
                            <Route exact path="/post">
                                <Auth />
                            </Route>
                        )
                    }
                    {isLoggedIn 
                        ? (
                            <Route exact path="/edit">
                                <Edit />
                            </Route>
                        ) : (
                            <Route exact path="/edit">
                                <Auth />
                            </Route>
                        )
                    }               
                    <Route exact path="/">
                        <Home isMobile={isMobile} userObj={userObj}/>
                    </Route>
                    <Route exact path="/detail" component={Detail} />
                    <Route exact path="/detail/:place" component={Detail} />
                    <Route exact path="/test/:test" component={Test} />
                    <Route exact path="/tips">
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