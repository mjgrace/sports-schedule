import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useYear } from "../contexts/YearContext";
import { useSeason } from "../contexts/SeasonContext";
import { useDate } from "../contexts/DateContext";
import "../styles/DateSelector.css";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = () => {
  const { date, setDate } = useDate(new Date());

  return (
    <span>
      <span>
        <label id="dateSelectorLabel" htmlFor="dateSelector">
          Date
        </label>
      </span>
      <span>
        <DatePicker
          id="dateSelector"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </span>
    </span>
  );
};

export default DateSelector;
