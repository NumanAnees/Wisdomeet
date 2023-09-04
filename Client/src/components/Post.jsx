// Post.jsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Comment from "./Comment";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { ThemeContext } from "../App";

const Post = ({ post, onEditPost, onDeletePost }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(post.body);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const user = useContext(ThemeContext);

  useEffect(() => {
    fetchCommentsForPost(post.id);
  }, [post.id]);

  const fetchCommentsForPost = async (postId) => {
    try {
      const commentsResponse = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
      );
      setComments(commentsResponse.data);
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
    }
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedBody(post.body);
    setEditedTitle(post.title);
  };

  const handleEditSave = () => {
    if (editedBody.length < 3 || editedTitle.length < 3) {
      toast.error("Title and body must be at least 3 characters long");
      return;
    }
    onEditPost(post.id, editedBody, editedTitle);

    setIsEditing(false);
  };

  const handleDeletePost = () => {
    onDeletePost(post.id);
  };

  const handleNewCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate comment length
      if (newComment.length < 3) {
        toast.error("Comment must be at least 3 characters long");
        return;
      }

      const newCommentData = {
        postId: post.id,
        id: uuidv4(),
        name: user.username,
        created_by: user.id,
        body: newComment,
        email: user.email,
      };

      // Update the comments state with the new comment
      setComments([...comments, newCommentData]);

      setNewComment("");
    } catch (error) {
      console.error("Error creating new comment:", error);
    }
  };

  const handleEditComment = async (commentId, editedBody) => {
    try {
      const editedCommentIndex = comments.findIndex(
        (comment) => comment.id === commentId
      );

      if (editedCommentIndex !== -1) {
        const updatedComments = [...comments];
        updatedComments[editedCommentIndex].body = editedBody;
        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          {isEditing ? (
            <input
              type="text"
              className="form-control mt-2"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <h5 className="card-title text-primary">{post.title}</h5>
          )}
          {user && user.id === post.userId && (
            <div className="d-flex flex-row align-items-end">
              <button className="btn btn-link" onClick={handleEditToggle}>
                {isEditing ? "Cancel" : <FaEdit />}
              </button>
              {isEditing ? (
                <button
                  className="btn btn-link text-danger"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-link text-danger"
                  onClick={handleDeletePost}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          )}
        </div>
        {isEditing ? (
          <textarea
            type="text"
            className="form-control mt-2"
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
          />
        ) : (
          <p className="card-text mt-2 ">{post.body}</p>
        )}
        <h6 className="margin-top text-info">Comments:</h6>
        <ul className="list-group">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </ul>
        <form onSubmit={handleNewCommentSubmit}>
          <div className="mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add a Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary mt-2">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
