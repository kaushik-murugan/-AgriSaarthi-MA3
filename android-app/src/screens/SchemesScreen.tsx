import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useOfflineData } from '../hooks/useOfflineData';
import { fetchSchemes, Scheme } from '../api/schemesApi';
import DataStatus from '../components/DataStatus';
import { useLocalization } from '../context/LanguageContext';

export default function SchemesScreen() {
  const { t } = useLocalization();
  const { data: schemes, lastUpdate, source, loading } = useOfflineData<Scheme[]>({
    fetchFn: fetchSchemes,
    storageKey: 'schemesData'
  });

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('government_schemes')}</Text>
      <DataStatus source={source} lastUpdate={lastUpdate} />

      <FlatList
        data={schemes || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text style={styles.eligibility}>{t('eligibility')}: {item.eligibility}</Text>
            <Text style={styles.link}>{item.link}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontWeight: 'bold', fontSize: 18 },
  card: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
  title: { fontWeight: 'bold', fontSize: 16 },
  eligibility: { marginTop: 4, color: '#2563eb' },
  link: { color: '#2563eb', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});