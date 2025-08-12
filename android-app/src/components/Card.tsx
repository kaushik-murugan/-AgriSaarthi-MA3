import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function Card({ children }: { children: React.ReactNode }) {
  const { isDark } = useContext(ThemeContext);
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          borderColor: isDark ? '#2C2C2C' : '#E5E7EB'
        }
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12
  }
});
