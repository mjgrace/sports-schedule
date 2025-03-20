import { createContext, useState, useContext } from "react";

const defaultCountry = "USA";

const CountryContext = createContext(null);

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(defaultCountry);

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
};

export default defaultCountry;
