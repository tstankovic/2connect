import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';

import { AppContext } from '../../context';
import firebase from '../../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    width: '100%',
    marginTop: theme.spacing(4),
  },
  header: {
    backgroundColor: theme.palette.grey[50],
  },
  actions: {
    backgroundColor: theme.palette.grey[50],
  },
  delete: {
    '&:hover': {
      color: theme.palette.error.dark,
    },
  },
}));

const Post = ({
  id,
  post: { content, imageUrl, avatar, createdBy, createdAt, likes, comments },
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const { user } = useContext(AppContext);

  const liked = likes.includes(user.uid);

  const handleLike = () => {
    const postRef = firebase.firestore().collection('posts').doc(id);
    let updatedLikes = [];
    if (liked) {
      updatedLikes = likes.filter((like) => like !== user.uid);
    } else {
      updatedLikes = [...likes, user.uid];
    }
    postRef.set(
      {
        likes: updatedLikes,
      },
      { merge: true }
    );
  };

  const handleDelete = async () => {
    const postRef = firebase.firestore().collection('posts').doc(id);
    await postRef.delete();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.header}
        avatar={<Avatar src={avatar} />}
        action={
          createdBy.id === user.uid && (
            <>
              <IconButton aria-label='settings' onClick={handleOpen}>
                <DeleteIcon className={classes.delete} />
              </IconButton>{' '}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Please confirm that you want to permanently delete this post
                    and it's content. This action is irreversible.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    color='primary'
                    variant='outlined'
                    autoFocus
                  >
                    cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    color='secondary'
                    variant='outlined'
                  >
                    delete
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )
        }
        title={
          <Typography variant='subtitle1'>{createdBy.username}</Typography>
        }
        subheader={
          <Typography variant='body2' color='textSecondary'>
            {`${formatDistanceToNow(new Date(createdAt))} ago`}
          </Typography>
        }
      />
      {imageUrl && <CardMedia component='img' image={imageUrl} />}
      {content && (
        <CardContent>
          <Typography variant='body1' component='p'>
            {content}
          </Typography>
        </CardContent>
      )}
      <CardActions className={classes.actions}>
        <Badge color='secondary' badgeContent={likes.length} overlap='circle'>
          <IconButton
            aria-label='like'
            className={classes.iconBtn}
            onClick={handleLike}
          >
            {liked ? (
              <FavoriteIcon color='secondary' />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Badge>
        <Badge color='primary' badgeContent={comments.length} overlap='circle'>
          <IconButton
            component={Link}
            to={`/post/${id}`}
            aria-label='comment'
            className={classes.iconBtn}
          >
            <CommentIcon />
          </IconButton>
        </Badge>
      </CardActions>
    </Card>
  );
};

export default Post;
