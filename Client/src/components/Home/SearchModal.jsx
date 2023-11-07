import React, { useState } from "react";
import { Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import { getToken } from "../../helpers/auth";

const SearchModal = ({ setQuestions, setIsSearchOpen }) => {
  const [open, setOpen] = useState(false);
  const authToken = getToken();
  const BASE_URL = process.env.REACT_APP_BASE_API;

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/?keyword=${values.text}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        resetForm();
        setQuestions(response.data);
        setIsSearchOpen(true);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to search!");
    }
  };

  return (
    <>
      <button className="nav-btn" onClick={() => setOpen(true)}>
        Search
      </button>

      <Modal
        title="Search for any Question"
        centered
        open={open}
        footer={null}
        className="custom-modal"
        width={900}
        height={500}
        onCancel={() => setOpen(false)}
      >
        <Formik
          initialValues={{
            text: "",
          }}
          onSubmit={handleSubmit}
        >
          {({}) => (
            <Form className="d-flex justify-content-between">
              <div className="mb-3 w-100">
                <Field
                  name="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <ErrorMessage
                  name="text"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="btn btn-danger custom-btn">
                Search
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default SearchModal;
