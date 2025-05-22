import React, { createContext, useContext } from 'react';
import AuthContext from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const isResearcher = user?.role === 'researcher';

  const theme = {
    role: user?.role || 'student',
    colors: isResearcher ? {
      primary: '#2ecc71',
      primaryLight: '#f0fff4',
      primaryDark: '#27ae60',
      accent: '#8e44ad',
      text: '#2c3e50',
      textLight: '#666'
    } : {
      primary: '#3498db',
      primaryLight: '#f0f7ff',
      primaryDark: '#2980b9',
      accent: '#f39c12',
      text: '#2c3e50',
      textLight: '#666'
    },
    typography: isResearcher ? {
      fontSize: '0.95rem',
      fontWeight: 'normal'
    } : {
      fontSize: '1rem',
      fontWeight: '500'
    },
    spacing: isResearcher ? {
      borderRadius: '8px',
      padding: '0.6rem 1rem'
    } : {
      borderRadius: '12px',
      padding: '0.8rem 1.2rem'
    },
    animation: isResearcher ? {
      duration: '0.2s',
      timing: 'ease'
    } : {
      duration: '0.3s',
      timing: 'ease-in-out'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;