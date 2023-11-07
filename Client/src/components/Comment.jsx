// Comment.jsx
import React, { useState, useContext } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ThemeContext } from "../App";

const Comment = ({ comment, onEditComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(comment.body);
  const user = useContext(ThemeContext);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedBody(comment.body);
  };

  const handleEditSave = () => {
    if (editedBody.length < 3) {
      toast.error("Comment must be at least 3 characters long");
      return;
    }
    onEditComment(comment.id, editedBody);
    setIsEditing(false);
    toast.success("Comment updated successfully!");
  };

  const handleDeleteComment = () => {
    onDeleteComment(comment.id);
    toast.success("Comment deleted successfully!");
  };

  return (
    <li className="list-group-item">
      <div className="d-flex align-items-start">
        <img
          src="https://www.ihna.edu.au/blog/wp-content/uploads/2022/10/user-dummy.png"
          alt="User Avatar"
          className="rounded-circle me-3"
          style={{ width: "40px", height: "40px" }}
        />
        <div className="flex-grow-1">
          <strong>{comment.name}</strong>
          {isEditing ? (
            <input
              type="text"
              className="form-control mt-2"
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
            />
          ) : (
            <p className="mb-0 mt-2">{comment.body}</p>
          )}
        </div>
        {user && user.email === comment.email && (
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
                onClick={handleDeleteComment}
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export default Comment;
