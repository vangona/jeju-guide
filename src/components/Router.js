import React from "react";
import { HashRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import Auth from "routes/Auth";
import Detail from "routes/Detail";
import Home from "routes/Home";
import MyPlace from "routes/MyPlace";
import Post from "routes/Post";
import Tips from "routes/Tips";

const AppRouter = ({ isLoggedIn, userObj, isMobile }) => {

    return (
        <>
            <Router>
                <Switch>
                    {isLoggedIn 
                        ? (                        
                            <Route exact path="/auth">
                                <Post userObj={userObj}/>
                            </Route>
                        ) : (    
                            <Route exact path="/auth">
                                <Auth />
                            </Route>
                            )
                    }
                    <Route exact path="/">
                        <Home isMobile={isMobile}/>
                    </Route>
                    <Route exact path="/detail">
                        <Detail />
                    </Route>
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