import React, { createContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const getSystemPreference = () => {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (error) {
    console.error('Error reading system theme:', error);
  }
  return 'light';
};

const getInitialTheme = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('app-theme') || getSystemPreference();
    }
  } catch (error) {
    console.error('Error initializing theme:', error);
  }
  return getSystemPreference();
};

// Handle light/dark theme switching
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [systemPreference, setSystemPreference] = useState(getSystemPreference);

  // Keep the stored system preference current for the auto option.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      setSystemPreference(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark-mode', theme === 'dark');
      root.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('app-theme', theme);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [theme]);

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
    isClient: true,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export { ThemeProvider, ThemeContext };
