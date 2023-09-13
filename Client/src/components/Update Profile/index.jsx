import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input, Button, Typography } from "antd";
import { getToken, getUser } from "../../helpers/auth";
import Layout from "../Layout";

import "./about.css";

const { Title } = Typography;

const About = () => {
  // Get user data from local storage
  const currentUser = getUser();
  const BASE_URL = process.env.REACT_APP_BASE_API;
  const { name, age, gender } = currentUser;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    age: Yup.number()
      .integer("Age must be an integer")
      .min(1, "Minimum age is 1")
      .max(149, "Maximum age is 149")
      .required("Age is required"),
    gender: Yup.string()
      .oneOf(["male", "female"], "Invalid gender")
      .required("Gender is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleUpdateProfile = async (values, { setFieldError }) => {
    const authToken = getToken();
    try {
      const response = await axios.put(`${BASE_URL}/user`, values, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const updatedUser = response.data.user;

      // Update user data in local storage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <Layout>
      <div className="profile-update-container">
        <Title className="quora-span" level={2}>
          Update Profile
        </Title>
        <Formik
          initialValues={{ name, age, gender, password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateProfile}
        >
          <Form className="profile-update-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label ">
                Name
              </label>
              <Field
                as={Input}
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="Enter name..."
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group">
              <label htmlFor="age" className="form-label ">
                Age
              </label>
              <Field
                as={Input}
                type="number"
                id="age"
                name="age"
                className="form-control"
                placeholder="Enter age..."
              />
              <ErrorMessage
                name="age"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="form-group">
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
            <div className="form-group">
              <label htmlFor="password" className="form-label ">
                New Password
              </label>
              <Field
                as={Input.Password}
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter password..."
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form>
        </Formik>
      </div>
    </Layout>
  );
};

export default About;
