import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { AppContext } from '../context';
import firebase from '../firebase';
import Post from '../components/Post/Post';

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
  commentForm: {
    backgroundColor: theme.palette.grey[100],
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  text: {
    padding: '2px 0',
  },
  noComments: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
  },
  delete: {
    '&:hover': {
      color: theme.palette.error.dark,
    },
  },
}));

const PostPage = (props) => {
  const classes = useStyles();

  const { user, authLoaded } = useContext(AppContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const db = firebase.firestore();
    const postRef = db.collection('posts').doc(id);
    const newComment = {
      id: uuidv4(),
      text: comment,
      createdBy: {
        id: user.uid,
        username: user.displayName,
        avatar: user.photoURL,
      },
      createdAt: new Date().toISOString(),
    };
    const updatedComments = [...post.post.comments, newComment];
    await postRef.update({ comments: updatedComments });
    setLoading(false);
    setComment('');
  };

  const handleDelete = async (commentId) => {
    const postRef = firebase.firestore().collection('posts').doc(id);
    const post = await postRef.get();
    const { comments } = post.data();
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    postRef.update({ comments: updatedComments });
  };

  const renderComments = () => {
    if (post.post.comments.length === 0) {
      return (
        <Typography
          className={classes.noComments}
          variant='body1'
          color='textSecondary'
        >
          So empty... Be first to leave a comment!
        </Typography>
      );
    }
    return (
      <List className={classes.list}>
        {post.post.comments.map(({ id, text, createdBy, createdAt }, i) => (
          <ListItem key={i} alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar src={createdBy.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <Typography variant='body2'>
                    <b>{createdBy.username}</b>
                  </Typography>
                  <Typography variant='body1' className={classes.text}>
                    {text}
                  </Typography>
                </div>
              }
              secondary={`${formatDistanceToNow(new Date(createdAt))} ago`}
            />
            {user.uid === createdBy.id && (
              <ListItemSecondaryAction>
                <IconButton
                  edge='end'
                  className={classes.delete}
                  onClick={() => handleDelete(id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    );
  };

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
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.commentForm} square elevation={0}>
            <form onSubmit={handleSubmit}>
              <TextField
                label='Write a comment...'
                fullWidth
                multiline
                rowsMax={4}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              {comment && (
                <Button
                  type='submit'
                  disabled={loading}
                  className={classes.button}
                  variant='outlined'
                  fullWidth
                >
                  comment
                </Button>
              )}
            </form>
          </Paper>
          {renderComments()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PostPage;
