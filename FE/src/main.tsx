import { tryLoadAndStartRecorder } from "@alwaysmeticulous/recorder-loader";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { persistor } from "../store/store";
import store from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
async function startApp() {
  if (!isProduction()) {
    await tryLoadAndStartRecorder({
      recordingToken: "CsOwjG3Hf7cWyvnReRIlB4eOXQ1N1wVFf4tH6lG5",
      isProduction: false,
    });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

function isProduction() {
  // Update with your production domain
  return window.location.hostname.indexOf("http://localhost:511173") > -1;
}

startApp();
