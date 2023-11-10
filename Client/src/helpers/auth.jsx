import Cookies from "js-cookie";

export const isAuth = () => {
  const currentUser = localStorage.getItem("currentUser");
  return !!currentUser;
};

export const getUser = () => {
  const currentUser = localStorage.getItem("currentUser");
  return JSON.parse(currentUser);
};

export const getToken = () => {
  const token = Cookies.get("token");
  return token;
};
