import React, { StrictMode, useState, createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// 1. Create the Context
export const Context = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

// 2. Create the Wrapper to hold the State
const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();

  return (
    <Context.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

// 3. Correct way to render in React 18+
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);