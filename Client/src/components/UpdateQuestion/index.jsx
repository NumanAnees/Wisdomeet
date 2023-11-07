import React, { useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getToken } from "../../helpers/auth";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";

const UpdateQuestionModal = ({ data, loadData }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  // Validation schema
  const validationSchema = Yup.object().shape({
    text: Yup.string()
      .min(3, "Text must be at least 3 characters long")
      .max(100, "Text must be at most 100 characters long")
      .required("Text is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const authToken = getToken();
    try {
      const formData = new FormData();
      formData.append("text", values.text);

      const response = await axios.put(
        `${BASE_URL}/questions/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        resetForm();
        setOpen(false);
        loadData();
        toast.success("Question updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Question!");
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
        title="Edit Question"
        centered
        open={open}
        footer={null}
        className="custom-modal"
        width={1300}
        onCancel={() => setOpen(false)}
      >
        <Formik
          initialValues={{
            text: data ? data.text : "",
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
                  placeholder="Your Question"
                  rows={6}
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="btn btn-danger w-100">
                Update Question
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default UpdateQuestionModal;
