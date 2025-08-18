import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import * as Location from 'expo-location';
import { ThemeContext } from '../context/ThemeContext';
import { useOfflineData } from '../hooks/useOfflineData';
import { fetchWeather } from '../api/weatherApi';
import ScreenWrapper from '../components/ScreenWrapper';
import Card from '../components/Card';
import DataStatus from '../components/DataStatus';
import { useLocalization } from '../context/LanguageContext';

export default function WeatherScreen() {
  const { t } = useLocalization();
  const { isDark } = useContext(ThemeContext);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_needed'), t('location_access_required'));
        return;
      }
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
      } catch (error) {
        console.error("Error getting current position:", error);
        Alert.alert(t('error'), t('failed_to_get_location'));
      }
    })();
  }, []);

  const { data: weather, lastUpdate, source, loading } = useOfflineData({
    fetchFn: coords
      ? async () => {
          const { data } = await fetchWeather(coords.lat, coords.lon);
          return data;
        }
      : async () => null,
    storageKey: 'weatherData',
    dependencies: [coords] // Add coords to dependencies
  });

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    subHeader: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    temp: { fontSize: 24, fontWeight: '700' },
    errorText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
  });

  if (!coords || loading) {
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
          {t('weather_data_not_available')}
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
          {t('weather_irrigation_tips')}
        </Text>
        <DataStatus source={source} lastUpdate={lastUpdate} />

        <Card>
          <Text style={[styles.temp, { color: isDark ? '#FFF' : '#111827' }]}>
            {Math.round(current.temperature)}°C — {t('condition_code')}: {current.weathercode}
          </Text>
          <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>
            {t('windspeed')}: {Math.round(current.windspeed)} km/h
          </Text>
          <Text style={{ marginTop: 8, color: isDark ? '#FFD700' : '#047857' }}>
            {daily.precipitation_probability_mean[0] > 50
              ? t('rain_likely_hold_irrigation')
              : t('low_rain_chance_consider_watering')}
          </Text>
        </Card>

        <Text style={[styles.subHeader, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          {t('seven_day_forecast')}
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
              <Text>{new Date(item.date).toDateString()}</Text>
              <Text>{t('max')}: {item.maxTemp}°C | {t('min')}: {item.minTemp}°C</Text>
              <Text>{t('rain_chance')}: {item.rainProb}%</Text>
            </Card>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
