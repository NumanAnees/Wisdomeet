import axios from "axios";
import { getToken } from "./auth";

export const handleFollowUnfollow = async (id) => {
  const authToken = getToken();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  try {
    await axios.put(
      `${BASE_URL}/topics/${id}/follow`,
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
