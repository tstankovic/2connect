import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from '../context';
import firebase from '../firebase';
import CreatePost from '../components/Post/CreatePost';
import PostList from '../components/Post/PostList';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  progress: {
    position: 'absolute',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(8),
  },
  noPosts: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
}));

const MainPage = () => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([user ? user.uid : '']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const db = firebase.firestore();
    user &&
      db
        .collection('users')
        .where('followers', 'array-contains', user.uid)
        .get()
        .then((users) => {
          setFollowing((prevFollowing) => [
            ...prevFollowing,
            ...users.docs.map((doc) => doc.id),
          ]);
        });
  }, [user]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('posts')
      .where('createdBy.id', 'in', following)
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs
            .map((doc) => ({ id: doc.id, data: doc.data() }))
            .sort(
              (a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt)
            )
        );
        setLoading(false);
      });

    return () => unsubscribe();
  }, [following]);

  if (!user) {
    return <Redirect to='/login' />;
  }

  return (
    <Container className={classes.root} maxWidth='sm'>
      <Grid container>
        <Grid item xs={12}>
          <CreatePost />
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <div className={classes.loading}>
              <CircularProgress className={classes.progress} size={256} />
            </div>
          ) : !posts.length ? (
            <Typography
              className={classes.noPosts}
              variant='body1'
              color='textSecondary'
            >
              So empty... You should probably follow someone
            </Typography>
          ) : (
            <PostList posts={posts} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
