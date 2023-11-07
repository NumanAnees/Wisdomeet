import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Modal, Select } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const { Option } = Select;

const QuestionModal = ({ getTopic }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get(`${BASE_URL}/topics/topics`);
        if (response.status === 200) {
          setTopics(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchTopics();
  }, [BASE_URL]);

  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, "Question must be at least 3 characters long")
      .required("Title is required"),
    topicIds: Yup.array()
      .of(Yup.number())
      .required("At least one topic is required")
      .min(1, "At least one topic is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const authToken = getToken();
    try {
      const response = await axios.post(
        `${BASE_URL}/questions/${id}`,
        {
          text: values.text,
          topicIds: values.topicIds,
        },
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
        getTopic();
        toast.success("Question added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question!");
    }
  };

  return (
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
        onCancel={() => setOpen(false)}
      >
        <Formik
          initialValues={{
            text: "",
            topicIds: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <Select
                  name="topicIds"
                  placeholder="Select Topics"
                  mode="multiple"
                  onChange={(selectedValues) =>
                    setFieldValue("topicIds", selectedValues)
                  }
                  className="w-100"
                >
                  {topics.map((topic) => (
                    <Option key={topic.id} value={topic.id}>
                      {topic.title}
                    </Option>
                  ))}
                </Select>
                <ErrorMessage
                  name="topicIds"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <Field
                  as="textarea"
                  name="text"
                  className="form-control"
                  placeholder="Your Answer"
                  rows={6}
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="btn btn-danger w-100">
                Add Question
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default QuestionModal;
