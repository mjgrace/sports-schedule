import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
// import App from "./App";
// import Content from "./Content";
import SeasonList from "./components/SeasonList";
import SeasonDropdown from "./components/SeasonDropdown";
import YearDropdown from "./components/YearDropdown";
import TeamList from "./components/TeamList";
import { YearProvider } from "./contexts/YearContext";
import { SeasonProvider } from "./contexts/SeasonContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <YearProvider>
      <SeasonProvider>
        <div class="form-flex-container">
          <YearDropdown />
          <SeasonDropdown />
        </div>
        <div>
          <TeamList />
        </div>
      </SeasonProvider>
    </YearProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
