import React, { useState, createContext, useContext } from 'react';

const translations = {
  en: require('../data/translations/en.json'),
  hi: require('../data/translations/hi.json'),
  ta: require('../data/translations/ta.json'),
  ka: require('../data/translations/ka.json'),
};

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: (language: string) => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children, forceRemount }: { children: React.ReactNode, forceRemount: () => void }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    const lang = translations[language];
    return lang[key] || key;
  };

  const setLanguageAndRemount = (lang: string) => {
    setLanguage(lang);
    forceRemount();
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndRemount, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLocalization = () => {
  return useContext(LanguageContext);
};
