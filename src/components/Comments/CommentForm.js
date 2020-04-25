import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { AppContext } from '../../context';
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
  commentForm: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const CommentForm = ({ post, id }) => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');

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
    const updatedComments = [...post.comments, newComment];
    await postRef.update({ comments: updatedComments });
    setLoading(false);
    setComment('');
  };

  return (
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
            {loading ? 'commenting...' : 'comment'}
          </Button>
        )}
      </form>
    </Paper>
  );
};

export default CommentForm;
