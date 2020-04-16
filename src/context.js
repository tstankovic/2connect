import React, { useState, useEffect, createContext } from 'react';

import firebase from './firebase';

export const AppContext = createContext();

const AppProvider = (props) => {
  const [user, setUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthLoaded(true);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

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
