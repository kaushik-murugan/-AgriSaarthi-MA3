import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { fetchMarketPrices, CropPrice } from '../api/marketApi';
import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import { ThemeContext } from '../context/ThemeContext';

export default function MarketPricesScreen() {
  const { isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<CropPrice[]>([]);

  useEffect(() => {
    fetchMarketPrices()
      .then(data => {
        setPrices(data);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', error.message || 'Failed to load market prices.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={isDark ? '#A7F3D0' : '#047857'} />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ padding: 16 }}>
        <Text style={[styles.header, { color: isDark ? '#A7F3D0' : '#047857' }]}>Market Prices</Text>
        <FlatList
          data={prices}
          keyExtractor={(item, index) => `${item.crop}-${index}`}
          renderItem={({ item }) => (
            <Card>
              <View style={styles.row}>
                <Text style={[styles.crop, { color: isDark ? '#FFF' : '#111827' }]}>{item.crop}</Text>
                <Text style={[styles.price, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                  {item.price} {item.unit}
                </Text>
                <Text style={[styles.market, { color: isDark ? '#A7F3D0' : '#047857' }]}>{item.market}</Text>
              </View>
            </Card>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  crop: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 16 },
  market: { fontSize: 14, fontStyle: 'italic' },
});
