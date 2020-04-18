import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from '../context';
import CreatePost from '../components/Post/CreatePost';
import PostList from '../components/Post/PostList';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  main: {
    backgroundColor: 'lightcyan',
  },
  side: {
    backgroundColor: 'lightsalmon',
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

const MainPage = () => {
  const classes = useStyles();

  const { user, authLoaded } = useContext(AppContext);

  if (!authLoaded) {
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
      <Grid container>
        <Grid item xs={12}>
          <CreatePost />
          <PostList />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
