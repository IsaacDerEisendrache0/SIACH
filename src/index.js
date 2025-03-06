import React from "react";
import ReactDOM from "react-dom/client"; // Importa desde 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Crea la raíz de React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
