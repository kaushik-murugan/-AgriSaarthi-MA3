import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useOfflineData } from '../hooks/useOfflineData';
import { fetchMarketPrices } from '../api/marketApi';
import DataStatus from '../components/DataStatus';
import * as Location from 'expo-location';
import MarketPriceItem from '../components/MarketPriceItem';
import { useLocalization } from '../context/LanguageContext';

export default function MarketPricesScreen() {
  const { t } = useLocalization();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg(t('permission_denied_location'));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const { data: prices, lastUpdate, source, loading } = useOfflineData({
    fetchFn: async () => {
      const { data } = await fetchMarketPrices(location?.coords.latitude, location?.coords.longitude);
      return data;
    },
    storageKey: 'marketPrices',
    dependencies: [location]
  });

  if (errorMsg) {
    return <View style={styles.center}><Text>{errorMsg}</Text></View>;
  }

  if (loading && !prices) return <ActivityIndicator style={styles.center} size="large" />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('market_prices')}</Text>
      <DataStatus source={source} lastUpdate={lastUpdate} />

      <FlatList
        data={prices || []}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <MarketPriceItem item={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
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