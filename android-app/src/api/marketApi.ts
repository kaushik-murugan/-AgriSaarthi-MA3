// src/api/marketApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface CropPrice {
  crop: string;
  price: number;
  market: string;
  date: string;
  unit: string;
}

const backendApi = axios.create({
  baseURL: 'http://172.16.11.236:3000', // Replace with your deployed backend URL
  timeout: 10000,
});

/**
 * Fetch market prices with offline fallback.
 * When online: saves to cache and returns live data.
 * When offline or API fails: returns cached data if available.
 */
export const fetchMarketPrices = async (): Promise<{
  data: CropPrice[];
  source: 'online' | 'offline';
  lastUpdate?: string;
}> => {
  const network = await NetInfo.fetch();

  // Try online fetch if connected
  if (network.isConnected) {
    try {
      const response = await backendApi.get<CropPrice[]>('/market-prices');
      const data = response.data;
      // Save to cache
      await AsyncStorage.setItem('marketPrices', JSON.stringify(data));
      await AsyncStorage.setItem('marketPrices_lastUpdate', new Date().toISOString());
      return { data, source: 'online' };
    } catch (error) {
      console.warn('Failed to fetch market prices online, trying cache:', error);
    }
  }

  // Fallback to cached data
  const cached = await AsyncStorage.getItem('marketPrices');
  const lastUpdate = await AsyncStorage.getItem('marketPrices_lastUpdate');

  return {
    data: cached ? (JSON.parse(cached) as CropPrice[]) : [],
    source: 'offline',
    lastUpdate: lastUpdate || undefined,
  };
};
