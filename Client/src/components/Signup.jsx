import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Layout from "./Layout";
import { postFormData } from "../helpers/axiosHelper";
import { SignupValidations } from "../helpers/Validators";
import { HTTP_STATUS_CREATED } from "../helpers/constants.js";

const Signup = () => {
  const Navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const handleSignup = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("name", values.name);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("picture", values.picture);

      const response = await postFormData(`${BASE_URL}/user/register`, formData);

      if (response.status === HTTP_STATUS_CREATED) {
        toast.info("User created successfully!");
        resetForm();
        Navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to signup");
    }
  };

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
            picture: null,
          }}
          validationSchema={SignupValidations}
          onSubmit={handleSignup}
        >
          {(
            { setFieldValue } // Use setFieldValue to handle file input changes manually
          ) => (
            <Form>
              <div className="mb-3">
                <Field type="text" name="name" className="form-control" placeholder="Name" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <Field type="email" name="email" className="form-control" placeholder="Email" />
                <ErrorMessage name="email" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <Field type="password" name="password" className="form-control" placeholder="Password" />
                <ErrorMessage name="password" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <Field type="number" name="age" className="form-control" placeholder="Age" />
                <ErrorMessage name="age" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <label className="form-label">Gender</label>
                <Field as="select" name="gender" className="form-control">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-danger" />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  name="picture"
                  className="form-control"
                  onChange={event => {
                    setFieldValue("picture", event.currentTarget.files[0]); //imp...
                  }}
                />
                <ErrorMessage name="picture" component="div" className="text-danger" />
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
  </Layout>;
};

export default Signup;
