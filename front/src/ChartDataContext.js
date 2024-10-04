import React, { createContext, useContext, useState } from 'react';

// Create a context
const ChartDataContext = createContext();

// Create a provider component
export const ChartDataProvider = ({ children }) => {
  const [chartData, setChartData] = useState([]);

  return (
    <ChartDataContext.Provider value={{ chartData, setChartData }}>
      {children}
    </ChartDataContext.Provider>
  );
};

// Create a custom hook to use the ChartData context
export const useChartData = () => {
  return useContext(ChartDataContext);
};
