import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Select } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { useParams } from "react-router-dom";
import { get, postFormData } from "../../helpers/axiosHelper";
import { QuestionValidations } from "../../helpers/Validators";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED } from "../../helpers/constants.js";

const { Option } = Select;

const QuestionModal = ({ getTopic }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await get(`${BASE_URL}/topics/topics`);
        if (response.status === HTTP_STATUS_OK) {
          setTopics(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchTopics();
  }, [BASE_URL]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await postFormData(`${BASE_URL}/questions/${id}`, {
        text: values.text,
        topicIds: values.topicIds,
      });

      if (response.status === HTTP_STATUS_CREATED || response.status === HTTP_STATUS_OK) {
        resetForm();
        resetFormFields();
        setOpen(false);
        getTopic();
        toast.success("Question added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question!");
    }
  };
  const resetFormFields = () => {
    setSelectedTopics([]);
  };

  <>
    <button className="nav-btn" onClick={() => setOpen(true)}>
      Ask Question
    </button>

    <Modal
      title="Add new Question"
      centered
      open={open}
      footer={null}
      className="custom-modal"
      width={1300}
      onCancel={() => {
        resetFormFields();
        setOpen(false);
      }}
    >
      <Formik
        initialValues={{
          text: "",
          topicIds: [],
        }}
        validationSchema={QuestionValidations}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-3">
              <Select
                name="topicIds"
                placeholder="Select Topics"
                mode="multiple"
                onChange={selectedValues => {
                  setFieldValue("topicIds", selectedValues);
                  setSelectedTopics(selectedValues);
                }}
                className="w-100"
                value={selectedTopics}
              >
                {topics.map(topic => (
                  <Option key={topic.id} value={topic.id}>
                    {topic.title}
                  </Option>
                ))}
              </Select>
              <ErrorMessage name="topicIds" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <Field as="textarea" name="text" className="form-control" placeholder="Your Answer" rows={6} />
              <ErrorMessage name="text" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-danger w-100">
              Add Question
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  </>;
};

export default QuestionModal;
