// src/screens/PlaceholderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlaceholderScreen({ route }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name} - Coming Soon 🚧</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 }
});
