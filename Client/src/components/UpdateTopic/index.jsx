import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

const TopicModalComponent = ({ data, loadData }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState();
  const authToken = getToken();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const initialValues = {
    title: topic?.title ?? "",
    description: topic?.description ?? "",
    picture: null,
  };
  useEffect(() => {
    getTopic();
  }, []);

  const getTopic = async () => {
    try {
      //get topic...
      const topic = await axios.get(`${BASE_URL}/topics/${data.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTopic(topic.data.Topic);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters long")
      .max(100, "Title must be at most 100 characters long")
      .required("Title is required"),
    description: Yup.string()
      .min(3, "Description must be at least 3 characters long")
      .max(100, "Description must be at most 100 characters long")
      .required("Description is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const authToken = getToken();
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("picture", values.picture);

      let response = await axios.put(
        `${BASE_URL}/topics/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        resetForm();
        setOpen(false);
        toast.success("Topic updated successfully!");
        loadData();
        getTopic();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update topic");
    }
  };

  return (
    <>
      <Button
        icon={<EditOutlined />}
        onClick={() => setOpen(true)}
        className="edit-button"
        size="large"
      />
      <Modal
        title="Edit Topic"
        centered
        open={open}
        footer={null}
        className="custom-modal"
        width={1300}
        onCancel={() => setOpen(false)}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <Field
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <Field
                  as="textarea"
                  type="description"
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  rows={6}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <img
                  src={data.topicPicture}
                  alt="topic picture"
                  height="100px"
                  width="100px"
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  name="picture"
                  className="form-control"
                  placeholder="Choose picture if you want to update the topic picture"
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
              <button type="submit" className="btn btn-danger w-100">
                Edit Topic
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default TopicModalComponent;
