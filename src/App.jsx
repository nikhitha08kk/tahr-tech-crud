import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/posts');
        setPosts(res.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
    };
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!formData.title || !formData.body) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const newPost = { title: formData.title, body: formData.body };
      const res = await axios.post('http://localhost:3001/posts', newPost);
      setPosts([...posts, res.data]);
      setFormData({ title: '', body: '' });
    } catch (error) {
      console.error('Error creating post', error);
    }
  };

  const editPost = (id) => {
    const post = posts.find((post) => post.id === id);
    setFormData({ title: post.title, body: post.body });
    setIsEditing(true);
    setEditId(id);
  };

  const updatePost = async () => {
    if (!formData.title || !formData.body) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const updatedPost = { title: formData.title, body: formData.body };
      await axios.put(`http://localhost:3001/posts/${editId}`, updatedPost);
      setPosts(posts.map((post) => (post.id === editId ? { ...post, ...updatedPost } : post)));
      setFormData({ title: '', body: '' });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error updating post', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">CRUD Application</h1>
        <div className="mb-8">
          <input
            type="text"
            className="input-field"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <textarea
            className="input-field"
            placeholder="Body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
          {isEditing ? (
            <button onClick={updatePost} className="button-update">
              Update Post
            </button>
          ) : (
            <button onClick={createPost} className="button-create">
              Create Post
            </button>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts available</p>
          ) : (
            <ul>
              {posts.map((post) => (
                <li key={post.id} className="post-item">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-body">{post.body}</p>
                  <div className="flex space-x-4 mt-4">
                    <button onClick={() => editPost(post.id)} className="button-edit">
                      Edit
                    </button>
                    <button onClick={() => deletePost(post.id)} className="button-delete">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
