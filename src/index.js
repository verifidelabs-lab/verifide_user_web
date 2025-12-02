// index.js
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import ProfileImageProvider from "./components/context/profileImageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <HelmetProvider>
    <Suspense fallback={<div>verified...</div>}>
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ProfileImageProvider>
              <App />
            </ProfileImageProvider>
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </Suspense>
  </HelmetProvider>
);
