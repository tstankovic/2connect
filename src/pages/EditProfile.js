import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    width: '60%',
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
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const EditProfile = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth='sm'>
      <Paper className={classes.paper}>
        <Typography className={classes.header} variant='h5'>
          Edit Profile
        </Typography>
        <Avatar className={classes.avatar} />
        <form className={classes.form}>
          <input
            accept='image/*'
            className={classes.input}
            id='contained-button-file'
            multiple
            type='file'
          />
          <label htmlFor='contained-button-file'>
            <Button
              variant='contained'
              color='secondary'
              component='span'
              endIcon={<CloudUploadIcon />}
            >
              upload
            </Button>
          </label>

          <TextField
            label='Email'
            fullWidth
            required
            className={classes.textField}
          />
          <TextField
            label='About'
            multiline
            rows='3'
            variant='outlined'
            fullWidth
            className={classes.textField}
          />
          <Button
            variant='contained'
            color='primary'
            fullWidth
            className={classes.button}
          >
            save
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
