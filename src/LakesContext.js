import React, { createContext, useState } from 'react';

const LakesContext = createContext();

const LakesProvider = ({ children }) => {
  const [lakes, setLakes] = useState([]);

  return (
    <LakesContext.Provider value={{ lakes, setLakes }}>
      {children}
    </LakesContext.Provider>
  );
};

export { LakesContext, LakesProvider };
