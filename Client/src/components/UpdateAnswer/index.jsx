import React, { useState } from "react";
import { Modal, Button } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { putFormData } from "../../helpers/axiosHelper";
import { UpdateAnswerValidations } from "../../helpers/Validators";
import { HTTP_STATUS_OK } from "../../helpers/constants.js";

const UpdateAnswerModal = ({ data, loadData }) => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("text", values.text);

      const response = await putFormData(`${BASE_URL}/answers/${data.id}`, formData);

      if (response.status === HTTP_STATUS_OK) {
        resetForm();
        setOpen(false);
        loadData();
        toast.success("Answer updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update answer!");
    }
  };

  <>
    <Button icon={<EditOutlined />} onClick={() => setOpen(true)} className="edit-button" size="large" />

    <Modal title="Edit Answer" centered open={open} footer={null} className="custom-modal" width={1300} onCancel={() => setOpen(false)}>
      <Formik
        initialValues={{
          text: data ? data.text : "",
        }}
        validationSchema={UpdateAnswerValidations}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-3">
              <Field as="textarea" name="text" className="form-control" placeholder="Your Answer" rows={6} />
              <ErrorMessage name="text" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-danger w-100">
              Update Answer
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  </>;
};

export default UpdateAnswerModal;
