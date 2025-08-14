import React, { useState, useContext } from 'react';
import { ScrollView, Text, View, StyleSheet, Switch, TouchableOpacity, Modal, Button } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useLocalization } from '../context/LanguageContext';
import ScreenWrapper from '../components/ScreenWrapper';

export default function SettingsScreen() {
  const [voice, setVoice] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { t, setLanguage, language } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);

  const backgroundCard = isDark ? '#1E1E1E' : '#FFF';
  const textColor = isDark ? '#FFF' : '#111';

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <ScreenWrapper>
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.header, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          {t('customize_your_experience')}
        </Text>
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <SettingRow label={t('farmer_name')} action={t('edit')} textColor={textColor} />
          <SettingRow label={t('location')} action={t('set_location')} textColor={textColor} />
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <SettingRow label={t('language_region')} action={t('choose_language')} textColor={textColor} />
          </TouchableOpacity>
          <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>{t(language === 'en' ? 'english' : language === 'hi' ? 'hindi' : 'tamil')}</Text>
        </View>
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <ToggleRow label={t('voice_responses')} value={voice} onValueChange={setVoice} textColor={textColor} />
          <ToggleRow label={t('dark_mode')} value={isDark} onValueChange={toggleTheme} textColor={textColor} />
          <ToggleRow label={t('weather_alerts')} value={weatherAlerts} onValueChange={setWeatherAlerts} textColor={textColor} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{t('choose_language')}</Text>
              <Button title="English" onPress={() => changeLanguage('en')} />
              <Button title="Hindi" onPress={() => changeLanguage('hi')} />
              <Button title="Tamil" onPress={() => changeLanguage('ta')} />
            </View>
          </View>
        </Modal>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
