import React, { useState, useEffect } from 'react';

import firebase from '../../firebase';
import Post from './Post';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} id={post.id} post={post.data} />
      ))}
    </>
  );
};

export default PostList;
