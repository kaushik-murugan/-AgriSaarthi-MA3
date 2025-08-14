import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useOfflineData } from '../hooks/useOfflineData';
import { fetchMarketPrices } from '../api/marketApi';
import DataStatus from '../components/DataStatus';

export default function MarketPricesScreen() {
  const { data: prices, lastUpdate, source, loading } = useOfflineData({
    fetchFn: async () => {
      const { data } = await fetchMarketPrices();
      return data;
    },
    storageKey: 'marketPrices'
  });

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Market Prices</Text>
      <DataStatus source={source} lastUpdate={lastUpdate} />

      <FlatList
        data={prices || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.crop}>🌾 {item.crop} – ₹{item.price} {item.unit}</Text>
            <Text style={styles.details}>📍 {item.market} | 📆 {item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontWeight: 'bold', fontSize: 18 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  crop: { fontSize: 16 },
  details: { fontSize: 12, color: '#555' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
