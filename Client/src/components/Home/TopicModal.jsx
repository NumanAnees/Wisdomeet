import React, { useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { toast } from "react-toastify";
import { postFormData } from "../../helpers/axiosHelper";
import { CreateTopicValidations } from "../../helpers/Validators";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED } from "../../helpers/constants.js";

const TopicModalComponent = ({ getTopics }) => {
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("picture", values.picture);

      const response = await postFormData(`${BASE_URL}/topics`, formData);

      if (response.status === HTTP_STATUS_CREATED || response.status === HTTP_STATUS_OK) {
        resetForm();
        setOpen(false);
        getTopics();
        toast.success("Topic added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add topic");
    }
  };

  <>
    <button className="nav-btn" onClick={() => setOpen(true)}>
      Add Topic
    </button>

    <Modal title="Add new Topic" centered open={open} footer={null} className="custom-modal" width={1300} onCancel={() => setOpen(false)}>
      <Formik
        initialValues={{
          title: "",
          description: "",
          picture: null,
        }}
        validationSchema={CreateTopicValidations}
        onSubmit={handleSubmit}
      >
        {(
          { setFieldValue } // Use setFieldValue to handle file input changes manually
        ) => (
          <Form>
            <div className="mb-3">
              <Field type="text" name="title" className="form-control" placeholder="Title" />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field as="textarea" type="description" name="description" className="form-control" placeholder="Description" rows={6} />
              <ErrorMessage name="description" component="div" className="text-danger" />
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
            <button type="submit" className="btn btn-danger w-100">
              Add Topic
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  </>;
};

export default TopicModalComponent;
