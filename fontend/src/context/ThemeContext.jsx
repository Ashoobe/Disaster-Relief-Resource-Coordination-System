import React, { createContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// Handle light/dark theme switching
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemPreference, setSystemPreference] = useState('light');
  const [isClient, setIsClient] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    setIsClient(true);
    
    try {
      if (window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setSystemPreference(prefersDark ? 'dark' : 'light');

        const savedTheme = localStorage.getItem('app-theme');
        setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark-mode', theme === 'dark');
      root.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('app-theme', theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme, isClient]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const setAutoTheme = useCallback(() => {
    setTheme(systemPreference);
  }, [systemPreference]);

  const value = {
    theme,
    systemPreference,
    toggleTheme,
    setAutoTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
