import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

export default function FarmToolsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Essential Farming Resources and Tools</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Today's Temp: 28°C</Text>
        <Text style={styles.text}>Perfect for farming</Text>
        <Text style={styles.title}>Rain Forecast: 40%</Text>
        <Text style={styles.text}>Chance of rain</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Agricultural Tools & Resources</Text>
        {['Q&A Forum','Weather Forecast','Pest Control',
          'Irrigation Guide','Crop Planning','Market Prices'
        ].map((tool) => (
          <Text key={tool} style={styles.listItem}>• {tool}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌾 Community Activity</Text>
        <Text>127 Questions Asked</Text>
        <Text>89 Questions Answered</Text>
        <Text>342 Active Farmers</Text>
        <Text>156 Tips Shared</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📞 Emergency Contacts</Text>
        <Text>Agriculture Helpline: 1800-180-1551</Text>
        <Text>Weather Emergency: 1077</Text>
        <Text>Kisan Call Center: 1800-180-1551</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 18, fontWeight: '600', color: '#047857', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#047857' },
  text: { fontSize: 14, color: '#374151', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#047857' },
  listItem: { fontSize: 14, color: '#374151', marginBottom: 2 }
});
