import React, { useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import firebase from '../../firebase';
import { AppContext } from '../../context';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
    marginBottom: theme.spacing(2),
  },
  header: {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    padding: theme.spacing(1.5),
  },
  content: {
    padding: '16px 16px 8px 16px',
  },
  input: {
    display: 'none',
  },
  imgUpload: {
    marginTop: theme.spacing(1),
  },
  actions: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  avatar: {
    backgroundColor: theme.palette.primary.dark,
  },
  postText: {
    width: '100%',
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

const CreatePost = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const { user } = useContext(AppContext);

  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const post = {
      content: text,
      imageUrl: '',
      likes: [],
      comments: [],
      createdBy: {
        id: user.uid,
        username: user.displayName,
      },
      avatar: user.photoURL,
      createdAt: new Date().toISOString(),
    };
    const db = firebase.firestore();
    if (image) {
      const { name, type } = image;
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`images/${uuidv4()}-${name}`);
      const metadata = { contentType: type };
      try {
        const uploadTask = await imageRef.put(image, metadata);
        const imageUrl = await uploadTask.ref.getDownloadURL();
        post.imageUrl = imageUrl;
        await db.collection('posts').add(post);
        setLoading(false);
        setText('');
        setImage(null);
      } catch (e) {
        console.error(e);
      }
    } else {
      await db.collection('posts').add(post);
      setLoading(false);
      setText('');
      setImage(null);
    }
  };

  return (
    <Card className={classes.root} variant='outlined'>
      <CardHeader
        className={classes.header}
        avatar={<Avatar src={user.photoURL} />}
        title={<Typography variant='h6'>{user.displayName}</Typography>}
      />
      <form onSubmit={handleSubmit}>
        <CardContent className={classes.content}>
          <TextField
            className={classes.postText}
            multiline
            label='Write something...'
            variant='outlined'
            rows='3'
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <input
            type='file'
            accept='image/*'
            className={classes.input}
            id='icon-button-file'
            onChange={handleChange}
          />
          <label htmlFor='icon-button-file'>
            <IconButton
              color='secondary'
              aria-label='upload picture'
              component='span'
            >
              <PhotoCamera className={classes.imgUpload} />
            </IconButton>
          </label>
          {image && (
            <Typography variant='caption' className={classes.imgName}>
              {image.name}
            </Typography>
          )}
        </CardContent>
        <CardActions className={classes.actions}>
          <Button
            type='submit'
            disabled={(!text && !image) || loading}
            variant='contained'
            color='primary'
            size='medium'
            endIcon={<SendIcon />}
          >
            {loading ? 'posting...' : 'post'}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

export default CreatePost;
