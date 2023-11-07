import React from "react";

const NoDataMessage = ({ text }) => {
  return (
    <div
      style={{
        backgroundColor: "transparent",
        padding: "20px",
        borderRadius: "5px",
        textAlign: "center",
        marginTop: "4rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "#555", fontSize: "18px" }}>Not any {text}</p>
    </div>
  );
};

export default NoDataMessage;
