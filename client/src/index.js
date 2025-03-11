import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
// import App from "./App";
// import Content from "./Content";
import SeasonList from "./components/SeasonList";
import YearDropdown from "./components/YearDropdown";
import { YearProvider } from "./contexts/YearContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <YearProvider>
      <YearDropdown />
      <SeasonList />
    </YearProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
