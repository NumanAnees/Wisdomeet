import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "./Post";
import { v4 as uuidv4 } from "uuid";
import Layout from "./Layout";
import { toast } from "react-toastify";
import { ThemeContext } from "../App";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const user = useContext(ThemeContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEditPost = async (commentId, editedBody, editedTitle) => {
    try {
      const editedCommentIndex = posts.findIndex(
        (comment) => comment.id === commentId
      );

      if (editedCommentIndex !== -1) {
        const updatedComments = [...posts];
        updatedComments[editedCommentIndex].body = editedBody;
        updatedComments[editedCommentIndex].title = editedTitle;
        setPosts(updatedComments);
        toast.success("Post updated successfully!");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Unable to Edit the post");
    }
  };

  const handleDeletePost = async (commentId) => {
    try {
      setPosts(posts.filter((comment) => comment.id !== commentId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Unable to delete the post");
    }
  };

  const fetchPosts = async () => {
    try {
      const postsResponse = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Unable to fetch the posts");
    }
  };
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate post title and body length
      if (newPostTitle.length < 3 || newPostBody.length < 3) {
        toast.error("Title and body must be at least 3 characters long");
        return;
      }

      const newPostData = {
        id: uuidv4(),
        title: newPostTitle,
        body: newPostBody,
        userId: user.id,
      };

      setPosts([newPostData, ...posts]);

      toast.success("New Post created successfully!");

      // Clear the new post form
      setNewPostTitle("");
      setNewPostBody("");
    } catch (error) {
      console.error("Error creating new post:", error);
      toast.error("Unable to create new post");
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2>Timeline</h2>
        <div className="mb-4">
          <div className="card p-4">
            <h4 className="mb-3">Create New Post</h4>
            <form onSubmit={handleNewPostSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Body"
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Post
              </button>
            </form>
          </div>
        </div>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
