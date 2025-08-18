import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalization } from '../context/LanguageContext';

interface DataStatusProps {
  source: 'online' | 'offline';
  lastUpdate?: string;
}

export default function DataStatus({ source, lastUpdate }: DataStatusProps) {
  const { t } = useLocalization();
  if (!lastUpdate) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        ({source})
      </Text>
      <Text style={styles.time}>
        {t('last_updated')}: {new Date(lastUpdate).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  status: { fontSize: 12, fontWeight: 'bold', color: '#4B5563' },
  time: { fontSize: 12, color: '#6B7280' },
});