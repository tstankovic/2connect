import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AppContext } from '../context';

const AuthRoute = ({ component: Component, ...props }) => {
  const { user } = useContext(AppContext);

  return user ? (
    <Route {...props} component={Component} />
  ) : (
    <Redirect to='/login' />
  );
};

export default AuthRoute;
