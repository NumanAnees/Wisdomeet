import axios from "axios";
import { getToken } from "./auth";

export const handleFollowUnfollow = async (id) => {
  const authToken = getToken();
  try {
    await axios.put(
      `http://localhost:8000/api/topics/${id}/follow`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (err) {
    console.error("There was a problem with the request:", err);
  }
};
