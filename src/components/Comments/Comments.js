import React from 'react';
import Grid from '@material-ui/core/Grid';

import CommentForm from './CommentForm';
import CommentList from './CommentList';

const Comments = ({ post: { post, id } }) => (
  <Grid container>
    <Grid item xs={12}>
      <CommentForm post={post} id={id} />
    </Grid>
    <Grid item xs={12}>
      <CommentList post={post} id={id} />
    </Grid>
  </Grid>
);

export default Comments;
