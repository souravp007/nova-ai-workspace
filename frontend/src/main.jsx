import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { store } from "./store/store.js";
import "./styles/index.css";

const storedTheme = localStorage.getItem("nova-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDarkTheme = storedTheme
  ? storedTheme === "dark"
  : prefersDark;

document.documentElement.classList.toggle("dark", shouldUseDarkTheme);
document.body.classList.toggle("dark", shouldUseDarkTheme);
document.documentElement.style.colorScheme = shouldUseDarkTheme
  ? "dark"
  : "light";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
