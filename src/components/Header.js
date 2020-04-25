import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';

import firebase from '../firebase';
import { AppContext } from '../context';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  // menuButton: {
  //   marginRight: theme.spacing(1),
  //   [theme.breakpoints.up('sm')]: {
  //     display: 'none',
  //   },
  // },
  title: {
    flexGrow: 1,
  },
  icons: {
    marginRight: theme.spacing(2),
  },
  login: {
    marginRight: theme.spacing(1),
  },
}));

const Header = (props) => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  async function logout() {
    try {
      await firebase.auth().signOut();
      props.history.push('/login');
    } catch (e) {
      console.log(e.message);
    }
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        {/* <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
        >
          <MenuIcon />
        </IconButton> */}
        <div className={classes.title}>
          <Button component={Link} to='/' color='inherit'>
            <b>2connect</b>
          </Button>
        </div>

        {user && (
          <div className={classes.icons}>
            <IconButton component={Link} to='/search' color='inherit'>
              <SearchIcon />
            </IconButton>

            <IconButton
              component={Link}
              to={`/profile/${user.uid}`}
              color='inherit'
            >
              <AccountCircleIcon />
            </IconButton>
          </div>
        )}

        <>
          {!user && (
            <Button
              component={Link}
              to='/login'
              color='inherit'
              variant='outlined'
              className={classes.login}
            >
              login
            </Button>
          )}
          {!user && (
            <Button
              component={Link}
              to='/register'
              color='inherit'
              variant='outlined'
            >
              register
            </Button>
          )}
          {user && (
            <Button color='inherit' variant='outlined' onClick={logout}>
              Logout
            </Button>
          )}
        </>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
