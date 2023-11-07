export const isAuth = () => {
  const currentUser = localStorage.getItem("currentUser");
  return !!currentUser; // Returns true if currentUser exists, false otherwise
};
