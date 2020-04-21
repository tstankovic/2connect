import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from '../context';
import firebase from '../firebase';
import Post from '../components/Post/Post';
import Comments from '../components/Comments/Comments';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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

const PostPage = (props) => {
  const classes = useStyles();

  const { user, authLoaded } = useContext(AppContext);

  const [post, setPost] = useState(null);

  const { id } = props.match.params;

  useEffect(() => {
    const db = firebase.firestore();
    const postRef = db.collection('posts').doc(id);
    const unsubscribe = postRef.onSnapshot((doc) => {
      if (!doc.exists) {
        return props.history.push('/');
      }
      setPost({ id: doc.id, post: doc.data() });
    });

    return () => unsubscribe();
  }, [id, props.history]);

  if (!authLoaded || !post) {
    return (
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} size={256} />
      </div>
    );
  } else {
    if (!user) {
      return <Redirect to='/login' />;
    }
  }

  return (
    <Container className={classes.root} maxWidth='sm'>
      <Post {...post} />
      <Comments post={post} />
    </Container>
  );
};

export default PostPage;
