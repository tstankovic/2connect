import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const Modal = ({ open, handleClose, handleDelete }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
    <DialogContent>
      <DialogContentText id='alert-dialog-description'>
        Please confirm you want to delete this post.
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
      <Button onClick={handleDelete} color='secondary' variant='outlined'>
        delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default Modal;
