import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { get, putFormData } from "../../helpers/axiosHelper";
import { UpdateTopicValidations } from "../../helpers/Validators";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED } from "../../helpers/constants.js";

const TopicModalComponent = ({ data, loadData }) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState();
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
      const topic = await get(`${BASE_URL}/topics/${data.id}`);
      setTopic(topic.data.Topic);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("picture", values.picture);

      let response = await putFormData(`${BASE_URL}/topics/${data.id}`, formData);
      if (response.status === HTTP_STATUS_CREATED || response.status === HTTP_STATUS_OK) {
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
      <Button icon={<EditOutlined />} onClick={() => setOpen(true)} className="edit-button" size="large" />
      <Modal title="Edit Topic" centered open={open} footer={null} className="custom-modal" width={1300} onCancel={() => setOpen(false)}>
        <Formik initialValues={initialValues} validationSchema={UpdateTopicValidations} enableReinitialize={true} onSubmit={handleSubmit}>
          {({ setFieldValue }) => (
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
                <img src={data.topicPicture} alt="topic picture" height="100px" width="100px" />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  name="picture"
                  className="form-control"
                  placeholder="Choose picture if you want to update the topic picture"
                  onChange={event => {
                    setFieldValue("picture", event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage name="picture" component="div" className="text-danger" />
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
