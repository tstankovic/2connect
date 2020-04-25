import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import firebase from '../firebase';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: 0,
  },
  username: {
    textDecoration: 'none',
    color: 'black',
  },
}));

const UserList = ({ currentUser, users }) => {
  const classes = useStyles();

  const handleFollow = (user, following) => {
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.id);
    const { followers } = user.data;
    let updatedFollowers = [];
    if (following) {
      updatedFollowers = followers.filter(
        (follower) => follower !== currentUser
      );
    } else {
      updatedFollowers = [...followers, currentUser];
    }
    userRef.update({ followers: updatedFollowers });
  };

  return (
    <List className={classes.root}>
      {users.map((user) => {
        const following = user.data.followers.find(
          (follower) => follower === currentUser
        );
        return (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar src={user.data.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Link className={classes.username} to={`/profile/${user.id}`}>
                  {user.data.username}
                </Link>
              }
            />
            {user.id !== currentUser && (
              <ListItemSecondaryAction>
                <Button
                  variant='outlined'
                  color={following ? 'secondary' : 'primary'}
                  onClick={() => handleFollow(user, following ? true : false)}
                >
                  {following ? 'unfollow' : 'follow'}
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default UserList;
