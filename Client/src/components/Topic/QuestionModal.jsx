import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const QuestionModal = ({ getTopic }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  //validation...
  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, "Question must be at least 3 characters long")
      .required("Title is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const authToken = getToken();
    try {
      const formData = new FormData();
      formData.append("text", values.text);

      const response = await axios.post(
        `${BASE_URL}/questions/${id}`,
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
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-3">
                <Field
                  as="textarea"
                  name="text"
                  className="form-control"
                  placeholder="Your Answer"
                  rows={6} // number of rows needed to display
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
