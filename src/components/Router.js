import React from "react";
import { HashRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Post from "routes/Post";

const AppRouter = ({ isLoggedIn, userObj }) => {
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
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </>
    );
};

export default AppRouter;