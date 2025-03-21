import { createContext, useState, useContext } from "react";

const defaultDate = new Date();

const DateContext = createContext(null);

export const DateProvider = ({ children }) => {
  const [date, setDate] = useState(defaultDate);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};

export default defaultDate;
