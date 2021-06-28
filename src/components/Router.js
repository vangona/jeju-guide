import React from "react";
import { HashRouter as Router, Route, Switch, useHistory} from "react-router-dom";
import Auth from "routes/Auth";
import Detail from "routes/Detail";
import Home from "routes/Home";
import MyPlace from "routes/MyPlace";
import Post from "routes/Post";

const AppRouter = ({ isLoggedIn, userObj }) => {
    const parentFunction = (data) => {
        console.log(data)
    }
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
                    <Route exact path="/detail">
                        <Detail />
                    </Route>
                    <Route exact path="/myplace">
                        <MyPlace parentFunction={parentFunction}/>
                    </Route>
                </Switch>
            </Router>
        </>
    );
};

export default AppRouter;