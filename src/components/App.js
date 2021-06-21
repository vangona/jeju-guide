import React, {useEffect, useState} from "react";
import AppRouter from "components/Router"
import {authService} from "fBase"

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setUserObj({
          uid:user.uid, 
        });
      } else {
        setUserObj(null);
      }
      setInit(true)
    })
  }, [])
  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={ userObj } /> : "Loading..."}
    </>
  );
}

export default App;
