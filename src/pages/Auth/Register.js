import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import firebase from '../../firebase';
import useFormValidation from '../../util/useFormValidation';
import { validateRegisterForm as validate } from '../../util/validation';
import { AppContext } from '../../context';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    position: 'relative',
  },
  progress: {
    position: 'absolute',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(8),
  },
  alert: {
    width: '100%',
  },
}));

const INITIAL_STATE = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function Register(props) {
  const classes = useStyles();

  const value = useContext(AppContext);
  const { user, authLoaded } = value;

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    clearError,
  } = useFormValidation(INITIAL_STATE, validate, register);

  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);

  async function register() {
    setLoading(true);
    const { username, email, password } = values;
    const db = firebase.firestore();
    try {
      const user = await db.collection('users').doc(username);
      if (user.exists) {
        setLoading(false);
        setFirebaseError('Account with that username already exists');
        return;
      }
      const image = 'default.jpg';
      const url = await firebase.storage().ref().child(image).getDownloadURL();
      const createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      await createdUser.user.updateProfile({
        displayName: username,
        photoURL: url,
      });
      await db.collection('users').doc(createdUser.user.uid).set({
        username: createdUser.user.displayName,
        avatar: createdUser.user.photoURL,
        posts: [],
        followers: [],
        following: [],
      });
      props.history.push('/');
    } catch (e) {
      setLoading(false);
      setFirebaseError(e.message);
    }
  }

  if (!authLoaded) {
    return (
      <div className={classes.loading}>
        <CircularProgress className={classes.progress} size={256} />
      </div>
    );
  } else {
    if (user && !loading) {
      return <Redirect to='/' />;
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                autoFocus
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                value={values.username}
                onChange={handleChange}
                error={errors.username ? true : false}
                helperText={errors.username && errors.username}
                onFocus={(e) => clearError(e.target.name)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                value={values.email}
                onChange={handleChange}
                error={errors.email ? true : false}
                helperText={errors.email && errors.email}
                onFocus={(e) => clearError(e.target.name)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                value={values.password}
                onChange={handleChange}
                error={errors.password ? true : false}
                helperText={errors.password && errors.password}
                onFocus={(e) => clearError(e.target.name)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                fullWidth
                name='confirmPassword'
                label='Confirm Password'
                type='password'
                id='confirmPassword'
                autoComplete='confirm-password'
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword ? true : false}
                helperText={errors.confirmPassword && errors.confirmPassword}
                onFocus={(e) => clearError(e.target.name)}
              />
            </Grid>
            {firebaseError && (
              <Grid item xs={12}>
                <Alert severity='error' className={classes.alert}>
                  {firebaseError}
                </Alert>
              </Grid>
            )}
          </Grid>
          <Button
            disabled={loading}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
            {loading && (
              <CircularProgress className={classes.progress} size={24} />
            )}
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <MuiLink component={Link} to='/login' variant='body2'>
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Register;
