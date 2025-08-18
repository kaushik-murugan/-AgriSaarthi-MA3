import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalization } from '../context/LanguageContext';
import ScreenWrapper from '../components/ScreenWrapper';

const MultilingualScreen = () => {
  const { setLanguage, language } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'ka', name: 'ಕನ್ನಡ' },
  ];

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setLanguage(langCode);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Language</Text>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              selectedLanguage === lang.code && styles.selectedLanguageButton,
            ]}
            onPress={() => handleLanguageChange(lang.code)}
          >
            <Text
              style={[
                styles.languageButtonText,
                selectedLanguage === lang.code && styles.languageButtonText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  selectedLanguageButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  languageButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectedLanguageButtonText: {
    color: '#fff',
  },
});

export default MultilingualScreen;