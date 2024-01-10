import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./Contexts/AuthContext";
import ToastProvider from "./Contexts/ToastProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { SideBarContextProvider } from "./Contexts/SideBarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SideBarContextProvider>
          <AuthContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthContextProvider>
        </SideBarContextProvider>
      </LocalizationProvider>
    </ToastProvider>
  </React.StrictMode>
);
