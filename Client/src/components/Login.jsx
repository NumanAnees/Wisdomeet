import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Login = () => {
  const Navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/login",
        values
      );

      if (response.status === 200) {
        const { user, token } = response.data;

        // Save the token in browser cookies
        document.cookie = `token=${token}`;

        // Save the user object in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        toast.info("Welcome Back!");
        Navigate("/");
      } else {
        console.log("Invalid email or password");
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
