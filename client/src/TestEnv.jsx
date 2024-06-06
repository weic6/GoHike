// client/src/TestEnv.jsx
import React from "react";

const TestEnv = () => {
  return (
    <div>
      <h1>Environment Variables</h1>
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
    </div>
  );
};

export default TestEnv;
