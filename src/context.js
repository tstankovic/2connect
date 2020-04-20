import React, { useState, useEffect, createContext } from 'react';

import firebase from './firebase';

export const AppContext = createContext();

const AppProvider = (props) => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setAuthLoaded(true);
      } else {
        setUser(null);
        setAuthLoaded(true);
      }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoaded,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
