import React, { useContext } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { AppContext } from '../../context';
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
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

const CommentList = ({ post, id }) => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const handleDelete = async (commentId) => {
    const postRef = firebase.firestore().collection('posts').doc(id);
    const doc = await postRef.get();
    const { comments } = doc.data();
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    postRef.update({ comments: updatedComments });
  };

  if (!post.comments.length) {
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
      {post.comments.map(({ id, text, createdBy, createdAt }, i) => (
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

export default CommentList;
