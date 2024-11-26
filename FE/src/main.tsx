import { tryLoadAndStartRecorder } from "@alwaysmeticulous/recorder-loader";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function startApp() {
  if (!isProduction()) {
    await tryLoadAndStartRecorder({
      recordingToken: "CsOwjG3Hf7cWyvnReRIlB4eOXQ1N1wVFf4tH6lG5",
      isProduction: false,
    });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

function isProduction() {
  // Update with your production domain
  return window.location.hostname.indexOf("http://localhkost:5173") > -1;
}

startApp();
