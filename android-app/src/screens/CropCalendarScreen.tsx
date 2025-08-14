import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useOfflineData } from '../hooks/useOfflineData';
import { fetchCropCalendar, CropCalendarEntry } from '../api/cropCalendarApi';
import DataStatus from '../components/DataStatus';

export default function CropCalendarScreen() {
  const { data: calendar, lastUpdate, source, loading } = useOfflineData<CropCalendarEntry[]>({
    fetchFn: fetchCropCalendar,
    storageKey: 'cropCalendarData'
  });

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crop Calendar</Text>
      <DataStatus source={source} lastUpdate={lastUpdate} />

      <FlatList
        data={calendar || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.crop}>{item.crop}</Text>
            <Text>{item.month} — {item.activity}</Text>
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
  crop: { fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
