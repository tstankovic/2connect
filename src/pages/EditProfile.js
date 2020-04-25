import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';

import { AppContext } from '../context';
import firebase from '../firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(6),
  },
  paper: {
    margin: 'auto',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
  },
  avatar: {
    marginTop: theme.spacing(2),
    height: '5rem',
    width: '5rem',
  },
  input: {
    display: 'none',
  },
  form: {
    marginTop: theme.spacing(1.5),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    marginTop: theme.spacing(2.5),
  },
  saveBtn: {
    marginTop: theme.spacing(3),
  },
  uploadBtn: {
    marginBottom: theme.spacing(1.5),
  },
  alert: {
    marginTop: theme.spacing(2),
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

const EditProfile = (props) => {
  const classes = useStyles();

  const { user } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [file, setFile] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {};

    if (email) {
      if (!email.includes('@')) {
        setError('Please enter a valid email adrress');
        return;
      }
      try {
        setLoading(true);
        await user.updateEmail(email);
        updatedUser.email = email;
      } catch (e) {
        setFirebaseError(e.message);
        setLoading(false);
        return;
      }
    }

    if (avatar) {
      const { name, type } = file;
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(`avatars/${uuidv4()}-${name}`);
      const metadata = { contentType: type };
      try {
        if (!loading) setLoading(true);
        const uploadTask = await imageRef.put(file, metadata);
        const imageUrl = await uploadTask.ref.getDownloadURL();
        await user.updateProfile({ photoURL: imageUrl });
        updatedUser.avatar = imageUrl;
      } catch (e) {
        setFirebaseError(e.message);
        setLoading(false);
        return;
      }
    }

    if (about) {
      updatedUser.about = about;
    }

    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    try {
      await userRef.update(updatedUser);
      setLoading(false);
      props.history.push(`/profile/${user.uid}`);
    } catch (e) {
      setFirebaseError(e.message);
      setLoading(false);
    }
  };

  if (!user) {
    return <Redirect to='/login' />;
  }

  return (
    <Container className={classes.root} maxWidth='xs'>
      <Paper className={classes.paper}>
        <Typography className={classes.header} variant='h5'>
          Edit Profile
        </Typography>
        <Avatar
          className={classes.avatar}
          src={avatar ? avatar : user.photoURL}
        />
        <form onSubmit={handleSubmit} className={classes.form}>
          <input
            type='file'
            accept='image/*'
            id='contained-button-file'
            className={classes.input}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor='contained-button-file'>
            <Button
              variant='contained'
              color='secondary'
              component='span'
              endIcon={<CloudUploadIcon />}
              className={classes.uploadBtn}
            >
              upload
            </Button>
          </label>

          <TextField
            label='Email'
            fullWidth
            margin='normal'
            style={{ margin: 8 }}
            className={classes.textField}
            placeholder={user.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setError('')}
            error={error ? true : false}
            helperText={error && error}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label='About (Optional)'
            multiline
            rows='3'
            variant='outlined'
            fullWidth
            className={classes.textField}
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
          {firebaseError && (
            <Alert severity='error' className={classes.alert}>
              {firebaseError}
            </Alert>
          )}
          <Button
            disabled={(!avatar && !about && !email) || loading}
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            className={classes.saveBtn}
          >
            {loading ? 'saving...' : 'save'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
