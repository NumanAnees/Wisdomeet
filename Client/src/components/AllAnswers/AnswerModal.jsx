import React, { useState } from "react";
import * as Yup from "yup";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { postFormData } from "../../helpers/axiosHelper";
import { HTTP_STATUS_OK, HTTP_STATUS_CREATED } from "../../helpers/constants.js";

const AnswerModal = ({ getAnswers }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, "text must be at least 3 characters long")
      .max(100, "text must be at most 100 characters long")
      .required("Title is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("text", values.text);

      const response = await postFormData(`${BASE_URL}/answers/${id}`, formData);

      if (response.status === HTTP_STATUS_CREATED || response.status === HTTP_STATUS_OK) {
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
  <>
    <button className="nav-btn" onClick={() => setOpen(true)}>
      Post Answer
    </button>

    <Modal title="Add new Answer" centered open={open} footer={null} className="custom-modal" width={1300} onCancel={() => setOpen(false)}>
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
              <Field as="textarea" name="text" className="form-control" placeholder="Your Answer" rows={6} />
              <ErrorMessage name="text" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-danger w-100">
              Add Answer
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  </>;
};

export default AnswerModal;
