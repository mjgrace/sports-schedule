import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
// import App from "./App";
// import Content from "./Content";
import SeasonList from "./components/SeasonList";
import SeasonDropdown from "./components/SeasonDropdown";
import YearDropdown from "./components/YearDropdown";
import { YearProvider } from "./contexts/YearContext";
import { SeasonProvider } from "./contexts/SeasonContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <YearProvider>
      <SeasonProvider>
        <YearDropdown />
        <SeasonDropdown />
        <SeasonList />
      </SeasonProvider>
    </YearProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
