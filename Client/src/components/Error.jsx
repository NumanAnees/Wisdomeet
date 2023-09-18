import React from "react";
import { useNavigate } from "react-router-dom";

import Layout from "./Layout";

const Error = () => {
  const Navigate = useNavigate();

  const goBack = () => {
    Navigate(-1);
  };
  <Layout>
    <div className="login-section d-flex justify-content-center align-items-center">
      <div className="card p-4">
        <h4 className="mb-4 text-primary">Error 404: Page not found</h4>
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  </Layout>;
};

export default Error;
