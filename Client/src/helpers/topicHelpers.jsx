import { getToken } from "./auth";
import { toast } from "react-toastify";
import { del, post, put } from "./axiosHelper";

import { HTTP_STATUS_OK, HTTP_STATUS_CREATED } from "./constants";

export const handleFollowUnfollow = async id => {
  const BASE_URL = process.env.REACT_APP_BASE_API;

  try {
    await put(`${BASE_URL}/topics/${id}/follow`, {});
  } catch (err) {
    console.error("There was a problem with the request:", err);
  }
};

export const handleLike = async (
  likes,
  dislikes,
  userLiked,
  userDisliked,
  setLikes,
  setDislikes,
  setUserLiked,
  setUserDisliked,
  type,
  ID
) => {
  try {
    const BASE_URL = process.env.REACT_APP_BASE_API;

    if (userLiked) {
      setLikes(likes - 1);
      setUserLiked(false);
      const like = await post(`${BASE_URL}/${type}/${ID}/like`, {});
    } else {
      setLikes(likes + 1);
      setUserLiked(true);
      const like = await post(`${BASE_URL}/${type}/${ID}/like`, {});
      if (userDisliked) {
        setDislikes(dislikes - 1);
        setUserDisliked(false);
        const dislike = await post(`${BASE_URL}/${type}/${ID}/dislike`, {});
      }
    }
  } catch (err) {
    toast.error("An error occurred");
  }
};

export const handleDislike = async (
  likes,
  dislikes,
  userLiked,
  userDisliked,
  setLikes,
  setDislikes,
  setUserLiked,
  setUserDisliked,
  type,
  ID
) => {
  const authToken = getToken();
  const BASE_URL = process.env.REACT_APP_BASE_API;
  if (userDisliked) {
    setDislikes(dislikes - 1);
    setUserDisliked(false);
    const dislike = await post(`${BASE_URL}/${type}/${ID}/dislike`, {});
  } else {
    setDislikes(dislikes + 1);
    setUserDisliked(true);
    const dislike = await post(`${BASE_URL}/${type}/${ID}/dislike`, {});
    if (userLiked) {
      setLikes(likes - 1);
      setUserLiked(false);
      const like = await post(`${BASE_URL}/${type}/${ID}/like`, {});
    }
  }
};

export const handleDelete = async (type, ID) => {
  try {
    const BASE_URL = process.env.REACT_APP_BASE_API;
    const request = await del(`${BASE_URL}/${type}/${ID}`);
    if (request.status == HTTP_STATUS_OK || request.status == HTTP_STATUS_CREATED) {
      toast.success("Deleted successfully");
    }
  } catch (err) {
    toast.error("Error deleting");
  }
};
