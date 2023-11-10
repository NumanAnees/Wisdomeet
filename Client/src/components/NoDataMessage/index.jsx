import React from "react";

import "./NoDataMessage.css";

const NoDataMessage = ({ text }) => (
  <div className="empty-div">
    <p style={{ color: "#555", fontSize: "18px" }}>Not any {text}</p>
  </div>
);

export default NoDataMessage;
