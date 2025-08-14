import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  const [key, setKey] = useState(0);

  const forceRemount = () => {
    setKey(prevKey => prevKey + 1);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider forceRemount={forceRemount}>
          <AppNavigator key={key} />
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}