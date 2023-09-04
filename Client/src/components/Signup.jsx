import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "./Layout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Signup = () => {
  const Navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
    name: Yup.string()
      .min(3, "Name must be at least 3 characters long")
      .required("Name is required"),
    age: Yup.number()
      .integer("Age must be an integer")
      .min(1, "Minimum age is 1")
      .max(149, "Maximum age is 149")
      .required("Age is required"),
    gender: Yup.string()
      .oneOf(["male", "female"], "Invalid gender")
      .required("Gender is required"),
  });

  const handleSignup = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("name", values.name);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("picture", values.picture); // Add picture to the formData

      const response = await axios.post(
        "http://localhost:8000/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.info("User created successfully!");
        resetForm();
        Navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to signup");
    }
  };

  return (
    <Layout>
      <div className="signup-section d-flex justify-content-center align-items-center">
        <div className="card p-4">
          <h2 className="mb-4">Sign Up</h2>
          <Formik
            initialValues={{
              email: "",
              password: "",
              name: "",
              age: "",
              gender: "male",
              picture: null, // Set initial value to null
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {(
              { setFieldValue } // Use setFieldValue to handle file input changes
            ) => (
              <Form>
                <div className="mb-3">
                  <Field
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
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
                <div className="mb-3">
                  <Field
                    type="number"
                    name="age"
                    className="form-control"
                    placeholder="Age"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <Field as="select" name="gender" className="form-control">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    name="picture"
                    className="form-control"
                    onChange={(event) => {
                      setFieldValue("picture", event.currentTarget.files[0]);
                    }}
                  />
                  <ErrorMessage
                    name="picture"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;