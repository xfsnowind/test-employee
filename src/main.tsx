import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
