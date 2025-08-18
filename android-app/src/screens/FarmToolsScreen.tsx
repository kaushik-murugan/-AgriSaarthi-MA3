import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather, WeatherData } from '../api/weatherApi';
import { ThemeContext } from '../context/ThemeContext';
import { useLocalization } from '../context/LanguageContext';

export default function FarmToolsScreen() {
  const { t } = useLocalization();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_needed'), t('location_access_required'));
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { data } = await fetchWeather(loc.coords.latitude, loc.coords.longitude);
      setWeather(data);
      setLoading(false);
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('essential_farming_resources')}</Text>

      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="small" color="#047857" />
        ) : weather ? (
          <>
            <Text style={styles.title}>{t('todays_temp')}: {Math.round(weather.current_weather.temperature)}°C</Text>
            <Text style={styles.text}>{t('perfect_for_farming')}</Text>
            <Text style={styles.title}>{t('rain_forecast')}: {weather.daily.precipitation_probability_mean[0]}%</Text>
            <Text style={styles.text}>{t('chance_of_rain')}</Text>
          </>
        ) : (
          <Text>{t('weather_data_not_available')}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('agricultural_tools_resources')}</Text>
        {['qa_forum','weather_forecast','pest_control',
          'irrigation_guide','crop_planning','market_prices'
        ].map((toolKey) => (
          <Text key={toolKey} style={styles.listItem}>• {t(toolKey)}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('community_activity')}</Text>
        <Text>127 {t('questions_asked')}</Text>
        <Text>89 {t('questions_answered')}</Text>
        <Text>342 {t('active_farmers')}</Text>
        <Text>156 {t('tips_shared')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('emergency_contacts')}</Text>
        <Text>{t('agriculture_helpline')}: 1800-180-1551</Text>
        <Text>{t('weather_emergency')}: 1077</Text>
        <Text>{t('kisan_call_center')}: 1800-180-1551</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  header: { fontSize: 18, fontWeight: '600', color: '#047857', marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 12, elevation: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#047857' },
  text: { fontSize: 14, color: '#374151', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#047857' },
  listItem: { fontSize: 14, color: '#374151', marginBottom: 2 }
});