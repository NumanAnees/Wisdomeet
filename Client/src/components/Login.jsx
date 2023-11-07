import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleLogin = () => {
    try {
      // Get existing users from local storage or initialize an empty array
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      //check if user exists
      const foundUser = existingUsers.find(
        (user) => user.email === email && user.password === password
      );

      // Clear input fields...
      setEmail("");
      setPassword("");

      if (foundUser) {
        // Set the current user's ID in local storage
        localStorage.setItem("currentUser", foundUser.id);
        toast.info("Welcome Back!");

        Navigate("/");
      } else {
        // Handle unsuccessful login
        console.log("Invalid email or password");
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to login");
    }
  };

  return (
    <Layout>
      <div className="login-section d-flex justify-content-center align-items-center">
        <div className="card p-4">
          <h2 className="mb-4">Login</h2>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Login
          </button>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
