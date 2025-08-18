import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CropPrice } from '../api/marketApi';

interface MarketPriceItemProps {
  item: CropPrice;
}

const MarketPriceItem: React.FC<MarketPriceItemProps> = ({ item }) => {
  return (
    <View style={styles.item}>
      <Text style={styles.crop}>🌾 {item.crop} – ₹{item.price} {item.unit}</Text>
      <Text style={styles.details}>📍 {item.market} | 📆 {item.date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  crop: { fontSize: 16 },
  details: { fontSize: 12, color: '#555' },
});

export default React.memo(MarketPriceItem);
