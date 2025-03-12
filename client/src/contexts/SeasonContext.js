import { createContext, useState, useContext } from "react";

const SeasonContext = createContext(null);

export const SeasonProvider = ({ children }) => {
  const [season, setSeason] = useState([]);

  return (
    <SeasonContext.Provider value={{ season, setSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
};
