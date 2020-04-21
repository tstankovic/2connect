import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AppProvider from './context';
import Header from './components/Header';
import Main from './pages/Main';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Post from './pages/Post';

const App = () => (
  <AppProvider>
    <Router>
      <Header />
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route path='/profile/:id' exact component={Profile} />
        <Route path='/edit-profile' exact component={EditProfile} />
        <Route path='/post/:id' exact component={Post} />
      </Switch>
    </Router>
  </AppProvider>
);

export default App;
