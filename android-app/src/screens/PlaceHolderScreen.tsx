// src/screens/PlaceholderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalization } from '../context/LanguageContext';

export default function PlaceholderScreen({ route }: any) {
  const { t } = useLocalization();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name}{t('coming_soon')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 }
});