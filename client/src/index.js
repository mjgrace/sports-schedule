import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";
import CountryDropdown from "./components/CountryDropdown";
import YearDropdown from "./components/YearDropdown";
import SeasonDropdown from "./components/SeasonDropdown";
import TeamList from "./components/TeamList";
import FixtureList from "./components/FixtureList";
import { CountryProvider } from "./contexts/CountryContext";
import { YearProvider } from "./contexts/YearContext";
import { DateProvider } from "./contexts/DateContext";
import { SeasonProvider } from "./contexts/SeasonContext";
import DateSelector from "./components/DateSelector";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CountryProvider>
      <YearProvider>
        <DateProvider>
          <SeasonProvider>
            <div class="form-flex-container">
              <CountryDropdown />
              <YearDropdown />
              <DateSelector />
              <SeasonDropdown />
            </div>
            <div>
              <FixtureList />
            </div>
            <div>
              <TeamList />
            </div>
          </SeasonProvider>
        </DateProvider>
      </YearProvider>
    </CountryProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
