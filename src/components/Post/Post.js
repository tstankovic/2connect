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
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteIcon from '@material-ui/icons/Delete';
import CommentIcon from '@material-ui/icons/Comment';

import { AppContext } from '../../context';
import firebase from '../../firebase';
import Modal from '../Post/DeletePost';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    width: '100%',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
  },
  header: {
    backgroundColor: theme.palette.grey[100],
  },
  actions: {
    backgroundColor: theme.palette.grey[100],
  },
  username: {
    textDecoration: 'none',
    color: 'black',
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
    postRef.update({ likes: updatedLikes });
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
              <Modal
                open={open}
                handleClose={handleClose}
                handleDelete={handleDelete}
              />
            </>
          )
        }
        title={
          <Typography
            component={Link}
            className={classes.username}
            to={`/profile/${createdBy.id}`}
            variant='subtitle1'
          >
            {createdBy.username}
          </Typography>
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
          <IconButton aria-label='like' onClick={handleLike}>
            {liked ? (
              <FavoriteIcon color='secondary' />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Badge>
        <Badge color='primary' badgeContent={comments.length} overlap='circle'>
          <IconButton component={Link} to={`/post/${id}`} aria-label='comment'>
            <CommentIcon />
          </IconButton>
        </Badge>
      </CardActions>
    </Card>
  );
};

export default Post;
