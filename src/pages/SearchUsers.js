import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { AppContext } from '../context';
import firebase from '../firebase';
import UserList from '../components/UserList';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  list: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    position: 'absolute',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(8),
  },
}));

const SearchUsers = () => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setUsers(users);
        setFilteredUsers(users);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilteredUsers(
      users.filter((user) => user.data.username.includes(searchTerm))
    );
  };

  if (!user) {
    return <Redirect to='/login' />;
  }

  return (
    <Container className={classes.root} maxWidth='sm'>
      <Paper onSubmit={handleSubmit} component='form' className={classes.paper}>
        <InputBase
          className={classes.input}
          placeholder='Search Users'
          inputProps={{ 'aria-label': 'search users' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IconButton
          type='submit'
          className={classes.iconButton}
          aria-label='search'
        >
          <SearchIcon />
        </IconButton>
      </Paper>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress className={classes.progress} size={256} />
        </div>
      ) : (
        <div className={classes.list}>
          <UserList currentUser={user.uid} users={filteredUsers} />
        </div>
      )}
    </Container>
  );
};

export default SearchUsers;
