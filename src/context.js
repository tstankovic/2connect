import React, { useState, useEffect, createContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import firebase from './firebase';

export const AppContext = createContext();

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(16),
  },
  progress: {
    position: 'absolute',
  },
}));

const AppProvider = (props) => {
  const classes = useStyles();

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

  if (!authLoaded) {
    return (
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} size={256} />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ user, authLoaded }}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
