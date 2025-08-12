import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { isDark } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDark ? '#10B981' : '#047857' } // slight lighter emerald in dark mode
      ]}
      onPress={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  label: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 }
});
