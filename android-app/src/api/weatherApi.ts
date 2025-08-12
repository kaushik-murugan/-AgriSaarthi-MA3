// src/api/weatherApi.ts
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

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
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
    return response.data as WeatherData;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error('Failed to fetch weather data');
  }
};
