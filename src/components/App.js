import React, {useEffect, useState} from "react";
import AppRouter from "components/Router"
import {authService} from "fBase"

const App = () => {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const userAgent = navigator.userAgent;
  const checkIsMobile = () => {
    if (userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || userAgent.match(/LG|SAMSUNG|Samsung/) != null){
      setIsMobile(false)
      } else{
      setIsMobile(true)
    }
  }
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setUserObj({
          uid:user.uid, 
        });
      } else {
        setUserObj(null);
      }
      checkIsMobile();
      setInit(true)
    })
  }, [])
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={ userObj } isMobile={isMobile} /> : "Loading..."}
    </>
  );
}

export default App;
