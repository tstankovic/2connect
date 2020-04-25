import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { AppContext } from '../context';
import firebase from '../firebase';
import PostList from '../components/Post/PostList';
import UserList from '../components/UserList';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  header: {
    textAlign: 'center',
    padding: `16px 0`,
  },
  dashboard: {
    padding: theme.spacing(3),
    display: 'flex',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flexGrow: '1',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    height: '4rem',
    width: '4rem',
  },
  user: {
    marginLeft: theme.spacing(2),
  },
  appBar: {
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
    textAlign: 'center',
    marginTop: theme.spacing(1),
  },
  joined: {
    marginLeft: theme.spacing(2),
  },
  about: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const ProfilePage = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const { user } = useContext(AppContext);

  const [value, setValue] = useState(0);
  const [posts, setPosts] = useState([]);
  const [profileOwner, setProfileOwner] = useState(null);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id } = props.match.params;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribePosts = db
      .collection('posts')
      .where('createdBy.id', '==', id)
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs
            .map((doc) => ({ id: doc.id, data: doc.data() }))
            .sort(
              (a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt)
            )
        );
      });
    const unsubscribeUser = db
      .collection('users')
      .doc(id)
      .onSnapshot((snapshot) => {
        setProfileOwner({ id: snapshot.id, data: snapshot.data() });
      });

    const unsubscribe = () => {
      unsubscribePosts();
      unsubscribeUser();
    };

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const db = firebase.firestore();
    let unsubscribeUsers = () => {};
    if (profileOwner && user) {
      unsubscribeUsers = db.collection('users').onSnapshot((snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        const followers = docs.filter((u) =>
          profileOwner.data.followers.includes(u.id)
        );
        const following = docs.filter((u) =>
          u.data.followers.includes(profileOwner.id)
        );
        setFollowers(followers);
        setFollowing(following);
      });
    }

    return () => unsubscribeUsers();
  }, [profileOwner, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleFollow = async () => {
    setLoading(true);
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(profileOwner.id);
    const { followers } = profileOwner.data;
    let updatedFollowers = [];
    if (followers.find((follower) => follower === user.uid)) {
      updatedFollowers = followers.filter((follower) => follower !== user.uid);
    } else {
      updatedFollowers = [...followers, user.uid];
    }
    await userRef.update({ followers: updatedFollowers });
    setLoading(false);
  };

  const renderActions = () => {
    if (id === user.uid) {
      return (
        <IconButton component={Link} to='/edit-profile'>
          <EditIcon color='primary' />
        </IconButton>
      );
    }
    const following = profileOwner.data.followers.find(
      (follower) => follower === user.uid
    );
    return (
      <Button
        disabled={loading}
        variant='contained'
        color={following ? 'secondary' : 'primary'}
        onClick={handleFollow}
      >
        {following ? 'unfollow' : 'follow'}
      </Button>
    );
  };

  if (!user) {
    return <Redirect to='/login' />;
  }

  if (!profileOwner) {
    return (
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} size={256} />
      </div>
    );
  }

  return (
    <Container className={classes.root} maxWidth='sm'>
      <Paper className={classes.paper}>
        <Typography variant='h4' className={classes.header}>
          Profile
        </Typography>
        <div className={classes.dashboard}>
          <div className={classes.info}>
            <Avatar src={profileOwner.data.avatar} className={classes.avatar} />
            <div className={classes.user}>
              <Typography variant='subtitle1'>
                {profileOwner.data.username}
              </Typography>
              <Typography variant='subtitle2' color='textSecondary'>
                {profileOwner.data.email}
              </Typography>
            </div>
          </div>
          <div className={classes.actions}>{renderActions()}</div>
        </div>
        <Typography variant='body2' className={classes.about}>
          {profileOwner.data.about}
        </Typography>
        <Typography
          component='span'
          variant='subtitle2'
          color='textSecondary'
          className={classes.joined}
        >
          Joined {new Date(profileOwner.data.createdAt).toLocaleDateString()}
        </Typography>
        <Divider variant='middle' />
        <AppBar className={classes.appBar} position='static' color='default'>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'
          >
            <Tab label='Posts' {...a11yProps(0)} />
            <Tab label='Followers' {...a11yProps(1)} />
            <Tab label='Following' {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {posts.length ? (
              <PostList posts={posts} />
            ) : (
              <Typography
                className={classes.noPosts}
                variant='body1'
                color='textSecondary'
              >
                No posts found
              </Typography>
            )}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <UserList currentUser={user.uid} users={followers} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <UserList currentUser={user.uid} users={following} />
          </TabPanel>
        </SwipeableViews>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
