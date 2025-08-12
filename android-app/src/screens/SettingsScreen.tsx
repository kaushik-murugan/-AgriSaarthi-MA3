import React, { useState, useContext } from 'react';
import { ScrollView, Text, View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';

export default function SettingsScreen() {
  const [voice, setVoice] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const backgroundCard = isDark ? '#1E1E1E' : '#FFF';
  const textColor = isDark ? '#FFF' : '#111';

  return (
    <ScreenWrapper>
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.header, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          Customize your experience
        </Text>
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <SettingRow label="Farmer Name" action="Edit" textColor={textColor} />
          <SettingRow label="Location" action="Set Location" textColor={textColor} />
          <SettingRow label="Language & Region" action="Choose Language" textColor={textColor} />
          <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>English</Text>
        </View>
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <ToggleRow label="Voice Responses" value={voice} onValueChange={setVoice} textColor={textColor} />
          <ToggleRow label="Dark Mode" value={isDark} onValueChange={toggleTheme} textColor={textColor} />
          <ToggleRow label="Weather Alerts" value={weatherAlerts} onValueChange={setWeatherAlerts} textColor={textColor} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const SettingRow = ({ label, action, textColor }: any) => (
  <View style={styles.row}>
    <Text style={{ color: textColor }}>{label}</Text>
    {action && (
      <TouchableOpacity><Text style={{ color: '#047857' }}>{action}</Text></TouchableOpacity>
    )}
  </View>
);

const ToggleRow = ({ label, value, onValueChange, textColor }: any) => (
  <View style={styles.row}>
    <Text style={{ color: textColor }}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} trackColor={{ true: '#047857' }} />
  </View>
);

const styles = StyleSheet.create({
  header: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  section: { borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }
});
