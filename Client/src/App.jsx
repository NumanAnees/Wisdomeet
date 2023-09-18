import React from "react";
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
import About from "./components/About";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => (
  <>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} exact />
          <Route path="/topic/:id" element={<Topic />} exact />
          <Route path="/update/profile" element={<UpdateProfile />} exact />
          <Route path="/about/:id" element={<About />} exact />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/question/:id" element={<AllAnswers />} exact />
        </Route>
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
