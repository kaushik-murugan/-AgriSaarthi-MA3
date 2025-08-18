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
  latitude?: number;
  longitude?: number;
}

const backendApi = axios.create({
  baseURL: 'your_backend_url', // Replace with your deployed backend URL
  timeout: 10000,
});

/**
 * Fetch market prices with offline fallback.
 * When online: saves to cache and returns live data.
 * When offline or API fails: returns cached data if available.
 */
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

export const fetchMarketPrices = async (latitude?: number, longitude?: number): Promise<{
  data: CropPrice[];
  source: 'online' | 'offline';
  lastUpdate?: string;
}> => {
  const network = await NetInfo.fetch();

  // Try online fetch if connected
  if (network.isConnected) {
    try {
      const response = await backendApi.get<CropPrice[]>('/market-prices', { params: { latitude, longitude } });
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
  let marketData: CropPrice[] = cached ? JSON.parse(cached) : [];

  if (latitude && longitude && marketData.length > 0) {
    marketData.sort((a, b) => {
        const distanceA = getDistance(latitude, longitude, a.latitude!, a.longitude!)
        const distanceB = getDistance(latitude, longitude, b.latitude!, b.longitude!)
        return distanceA - distanceB;
    });
  }


  return {
    data: marketData,
    source: 'offline',
    lastUpdate: lastUpdate || undefined,
  };
};
