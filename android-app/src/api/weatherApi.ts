import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
});

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_mean: number[];
  };
  timezone: string;
}

/**
 * Fetches weather data either online (and caches it) or falls back to cached data if offline or failed.
 */
export const fetchWeather = async (lat: number, lon: number): Promise<{
  data: WeatherData | null;
  source: 'online' | 'offline';
  lastUpdate?: string;
}> => {
  const network = await NetInfo.fetch();

  if (network.isConnected) {
    try {
      const response = await weatherApi.get('/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_mean',
          current_weather: true,
          timezone: 'auto',
        },
      });
      const data = response.data as WeatherData;
      await AsyncStorage.setItem('weatherData', JSON.stringify(data));
      await AsyncStorage.setItem('weatherData_lastUpdate', new Date().toISOString());
      return { data, source: 'online' };
    } catch (error) {
      console.warn('Weather API fetch failed, loading cached data', error);
    }
  }

  // Offline or fetch failed — load from cache
  const cached = await AsyncStorage.getItem('weatherData');
  const lastUpdate = await AsyncStorage.getItem('weatherData_lastUpdate');
  return {
    data: cached ? (JSON.parse(cached) as WeatherData) : null,
    source: 'offline',
    lastUpdate: lastUpdate || undefined,
  };
};
