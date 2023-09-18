import React from "react";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input, Button, Typography } from "antd";

import { getUser } from "../../helpers/auth";
import { put } from "../../helpers/axiosHelper";
import { UpdateProfileValidations } from "../../helpers/Validators";
import Layout from "../Layout";

import "./about.css";

const { Title } = Typography;

const About = () => {
  const currentUser = getUser();
  const BASE_URL = process.env.REACT_APP_BASE_API;
  const { name, age, gender } = currentUser;

  const handleUpdateProfile = async (values, { setFieldError }) => {
    try {
      const response = await put(`${BASE_URL}/user`, values);
      const updatedUser = response.data.user;

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  <Layout>
    <div className="profile-update-container">
      <Title className="quora-span" level={2}>
        Update Profile
      </Title>
      <Formik
        initialValues={{ name, age, gender, password: "" }}
        validationSchema={UpdateProfileValidations}
        onSubmit={handleUpdateProfile}
      >
        <Form className="profile-update-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label ">
              Name
            </label>
            <Field as={Input} type="text" id="name" name="name" className="form-control" placeholder="Enter name..." />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>
          <div className="form-group">
            <label htmlFor="age" className="form-label ">
              Age
            </label>
            <Field as={Input} type="number" id="age" name="age" className="form-control" placeholder="Enter age..." />
            <ErrorMessage name="age" component="div" className="text-danger" />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <Field as="select" name="gender" className="form-control">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Field>
            <ErrorMessage name="gender" component="div" className="text-danger" />
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
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>
          <Button type="primary" htmlType="submit">
            Update Profile
          </Button>
        </Form>
      </Formik>
    </div>
  </Layout>;
};

export default About;
