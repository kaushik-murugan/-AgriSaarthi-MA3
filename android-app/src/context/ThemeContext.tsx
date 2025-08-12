import React, { useState, useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';

export const ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    setIsDark(systemScheme === 'dark');
  }, [systemScheme]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
