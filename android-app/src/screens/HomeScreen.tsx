import React, { useContext } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../context/ThemeContext';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';

export default function HomeScreen({ navigation }: any) {
  const { isDark } = useContext(ThemeContext);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.welcome, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          👋 Welcome to KrishiMitra
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
          Your personal AI-powered agriculture assistant
        </Text>

        <Card>
          <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#047857' }]}>
            Quick Actions
          </Text>
          <PrimaryButton label="Chat with AI" onPress={() => navigation.navigate('Chat')} />
          <PrimaryButton label="Farm Tools" onPress={() => navigation.navigate('Farm Tools')} />
          <PrimaryButton label="Settings" onPress={() => navigation.navigate('Settings')} />
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 15 },
  cardTitle: { marginBottom: 8, fontSize: 16, fontWeight: '600' }
});
