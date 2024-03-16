import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import "./main.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import Register from "./pages/Register.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <Router>
         <Routes>
            <Route index element={<App />} />
            <Route path="/register" element={<Register />} />
         </Routes>
      </Router>
   </React.StrictMode>
);
