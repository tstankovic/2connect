import React, { useState, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import firebase from '../firebase';
import { AppContext } from '../context';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  icons: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  login: {
    marginRight: theme.spacing(1),
  },
  list: {
    width: 250,
  },
}));

const Header = (props) => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  async function logout() {
    try {
      await firebase.auth().signOut();
      props.history.push('/login');
    } catch (e) {
      console.log(e.message);
    }
  }

  const list = () => (
    <div
      className={classes.list}
      role='presentation'
      onClick={() => setOpen(false)}
      onKeyDown={() => setOpen(false)}
    >
      {user && (
        <>
          <List>
            <ListItem button component={Link} to='/'>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>
            <ListItem button component={Link} to={`/profile/${user.uid}`}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItem>
            <ListItem button component={Link} to='/search'>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary='User Search' />
            </ListItem>
          </List>
          <Divider />
        </>
      )}
      <List>
        {user ? (
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary='Logout' />
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} to='/login'>
              <ListItemIcon>
                <LockOpenIcon />
              </ListItemIcon>
              <ListItemText primary='Login' />
            </ListItem>
            <ListItem button component={Link} to='/register'>
              <ListItemIcon>
                <LockOpenIcon />
              </ListItemIcon>
              <ListItemText primary='Register' />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton
          edge='start'
          className={classes.menuButton}
          color='inherit'
          aria-label='menu'
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer anchor='left' open={open} onClose={() => setOpen(false)}>
          {list()}
        </Drawer>
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

        {!user && (
          <>
            <Button
              component={Link}
              to='/login'
              color='inherit'
              variant='outlined'
              className={classes.login}
            >
              login
            </Button>

            <Button
              component={Link}
              to='/register'
              color='inherit'
              variant='outlined'
            >
              register
            </Button>
          </>
        )}
        {user && (
          <Button color='inherit' variant='outlined' onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
