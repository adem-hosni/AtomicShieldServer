import React from "react";
import { useParams } from "react-router-dom";

export function DashboardContentTest() {
  const { serverId } = useParams<{ serverId: string }>();

  console.log("🧪 DashboardContentTest rendering with serverId:", serverId);

  return (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "20px",
        fontSize: "24px",
        minHeight: "100vh",
        border: "5px solid yellow",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        🧪 TEST COMPONENT WORKING!
      </h1>
      <p>Server ID: {serverId}</p>
      <p>Current Time: {new Date().toLocaleTimeString()}</p>
      <div
        style={{
          backgroundColor: "blue",
          padding: "20px",
          margin: "20px 0",
          border: "3px solid green",
        }}
      >
        <p>This is a nested div to test CSS rendering</p>
      </div>
    </div>
  );
}
