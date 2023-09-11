import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import UpdateProfile from "./components/Update Profile";
import PrivateRoute from "./helpers/PrivateRoute";
import Error from "./components/Error";
import Topic from "./components/Topic";
import AllAnswers from "./components/AllAnswers";
import Profile from "./components/Profile";

//css imports
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export const ThemeContext = React.createContext();

const App = () => {
  const [currentUser, setCurrentUser] = useState();
  //simple useEffect...
  useEffect(() => {
    SetUser();
  }, []);
  //set user function for setting current user...
  const SetUser = () => {
    const userId = localStorage.getItem("currentUser");
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    const user = existingUsers.find((el) => el.id === userId);
    setCurrentUser(user);
  };
  return (
    <>
      <ToastContainer />
      <ThemeContext.Provider value={currentUser}>
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/:id" element={<Topic />} exact />
              <Route path="/" element={<Home />} exact />
              <Route path="/update/profile" element={<UpdateProfile />} exact />
              <Route path="/profile/:id" element={<Profile />} exact />
              <Route path="/profile" element={<Profile />} exact />
              <Route path="/question/:id" element={<AllAnswers />} exact />
            </Route>
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
