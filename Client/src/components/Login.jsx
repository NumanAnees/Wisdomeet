import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Layout from "./Layout";

const Login = () => {
  const Navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${BASE_URL}/user/login`, values);
      if (response.status === 200) {
        const { user, token } = response.data;

        document.cookie = `token=${token}`;

        localStorage.setItem("currentUser", JSON.stringify(user));

        toast.info("Welcome Back!");
        Navigate("/");
      } else if (response.status === 203) {
        toast.error("Please confirm your email address first");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to login");
    }
  };

  return (
    <Layout>
      <div className="login-section d-flex justify-content-center align-items-center">
        <div className="card p-4">
          <h2 className="mb-4">Login</h2>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form>
              <div className="mb-3">
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>
              <Link to="/signup">Create an account</Link>
            </Form>
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
