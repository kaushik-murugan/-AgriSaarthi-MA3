import React, { useContext } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { ThemeContext } from '../context/ThemeContext';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { useLocalization } from '../context/LanguageContext';

export default function HomeScreen({ navigation }: any) {
  const { t } = useLocalization();
  const { isDark } = useContext(ThemeContext);

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={[styles.welcome, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          {t('welcome_message')}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
          {t('ai_assistant_subtitle')}
        </Text>

        <Card>
          <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#047857' }]}>
            {t('quick_actions')}
          </Text>
          <PrimaryButton label={t('chat_with_ai')} onPress={() => navigation.navigate('Chat')} />
          <PrimaryButton label={t('farm_tools')} onPress={() => navigation.navigate('Farm Tools')} />
          <PrimaryButton label={t('settings')} onPress={() => navigation.navigate('Settings')} />
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