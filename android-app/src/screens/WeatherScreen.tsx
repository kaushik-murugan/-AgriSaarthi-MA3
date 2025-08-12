// src/screens/WeatherScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather, WeatherData } from '../api/weatherApi';
import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import { ThemeContext } from '../context/ThemeContext';

export default function WeatherScreen() {
  const { isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Location access is needed to provide weather updates.'
        );
        setLoading(false);
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({});
        const data = await fetchWeather(loc.coords.latitude, loc.coords.longitude);
        setWeather(data);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color="#047857" />
      </ScreenWrapper>
    );
  }

  if (!weather) {
    return (
      <ScreenWrapper>
        <Text style={[styles.errorText, { color: isDark ? '#FFC7C7' : '#B91C1C' }]}>
          Weather data is not available.
        </Text>
      </ScreenWrapper>
    );
  }

  const current = weather.current_weather;
  const daily = weather.daily;

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={[styles.header, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          Weather & Irrigation Tips
        </Text>

        <Card>
          <Text style={[styles.temp, { color: isDark ? '#FFF' : '#111827' }]}>
            {Math.round(current.temperature)}°C — Condition Code: {current.weathercode}
          </Text>

          <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
            Windspeed: {Math.round(current.windspeed)} km/h
          </Text>

          <Text style={{ marginTop: 8, color: isDark ? '#FFD700' : '#047857' }}>
            {daily.precipitation_probability_mean[0] > 50
              ? '💧 Rain likely — hold irrigation today'
              : '☀ Low rain chance — consider watering your crops'}
          </Text>
        </Card>

        <Text style={[styles.subHeader, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          7-Day Forecast
        </Text>

        <FlatList
          data={daily.time.map((date, index) => ({
            date,
            maxTemp: daily.temperature_2m_max[index],
            minTemp: daily.temperature_2m_min[index],
            rainProb: daily.precipitation_probability_mean[index],
          }))}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => (
            <Card>
              <Text style={{ color: isDark ? '#FFF' : '#111827' }}>
                {new Date(item.date).toDateString()}
              </Text>
              <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
                Max: {Math.round(item.maxTemp)}°C | Min: {Math.round(item.minTemp)}°C
              </Text>
              <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
                Rain Chance: {Math.round(item.rainProb)}%
              </Text>
            </Card>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  subHeader: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  temp: { fontSize: 24, fontWeight: '700' },
  errorText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});
