import React from 'react';

import Post from './Post';

const PostList = ({ posts }) =>
  posts.map((post) => <Post key={post.id} id={post.id} post={post.data} />);

export default PostList;
