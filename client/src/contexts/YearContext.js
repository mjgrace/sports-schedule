import { createContext, useState, useContext } from "react";

const defaultYear = new Date().getFullYear();

const YearContext = createContext(null);

export const YearProvider = ({ children }) => {
  const [year, setYear] = useState(defaultYear);

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};

export default defaultYear;
