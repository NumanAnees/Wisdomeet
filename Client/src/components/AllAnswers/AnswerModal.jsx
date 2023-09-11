import React, { useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken } from "../../helpers/auth";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AnswerModal = ({ getAnswers }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.BASE_API;

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

      const response = await axios.post(`${BASE_URL}/answers/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        resetForm();
        setOpen(false);
        getAnswers();
        toast.success("Answer added successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add answer!");
    }
  };

  return (
    <>
      <button className="nav-btn" onClick={() => setOpen(true)}>
        Post Answer
      </button>

      <Modal
        title="Add new Answer"
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
                Add Answer
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default AnswerModal;
