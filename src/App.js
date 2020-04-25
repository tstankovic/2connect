import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import AppProvider from './context';
import Header from './components/Header';
import Main from './pages/Main';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Post from './pages/Post';
import SearchUsers from './pages/SearchUsers';
import AuthRoute from './util/AuthRoute';

const App = () => (
  <AppProvider>
    <Router>
      <Header />
      <Switch>
        <AuthRoute path='/' exact component={Main} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <AuthRoute path='/profile/:id' exact component={Profile} />
        <AuthRoute path='/edit-profile' exact component={EditProfile} />
        <AuthRoute path='/post/:id' exact component={Post} />
        <AuthRoute path='/search' exact component={SearchUsers} />
        <Redirect to='/' />
      </Switch>
    </Router>
  </AppProvider>
);

export default App;
