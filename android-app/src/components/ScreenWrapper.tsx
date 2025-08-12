import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useContext(ThemeContext);

  const backgroundColor = isDark ? '#121212' : '#F9FAFB';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }
});
