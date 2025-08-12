import React, { useContext } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemedInput(props: any) {
  const { isDark } = useContext(ThemeContext);
  return (
    <TextInput
      {...props}
      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
      style={[
        styles.input,
        {
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#111827',
          borderColor: isDark ? '#2C2C2C' : '#D1D5DB'
        }
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14
  }
});
