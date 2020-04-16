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
import { validateLoginForm as validate } from '../../util/validation';
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
    marginTop: theme.spacing(1),
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
    marginTop: theme.spacing(1),
  },
}));

const INITIAL_STATE = {
  email: '',
  password: '',
};

function Login(props) {
  const classes = useStyles();

  const value = useContext(AppContext);
  const { user, authLoaded } = value;

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    clearError,
  } = useFormValidation(INITIAL_STATE, validate, login);

  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState(false);

  async function login() {
    setLoading(true);
    const { email, password } = values;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
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
    if (user) {
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
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
            onChange={handleChange}
            value={values.email}
            error={errors.email ? true : false}
            helperText={errors.email && errors.email}
            onFocus={(e) => clearError(e.target.name)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onChange={handleChange}
            value={values.password}
            error={errors.password ? true : false}
            helperText={errors.password && errors.password}
            onFocus={(e) => clearError(e.target.name)}
          />
          {firebaseError && (
            <Alert severity='error' className={classes.alert}>
              {firebaseError}
            </Alert>
          )}
          <Button
            disabled={loading}
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
            {loading && (
              <CircularProgress className={classes.progress} size={24} />
            )}
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink href='#' variant='body2'>
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={Link} to='/register' variant='body2'>
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Login;
