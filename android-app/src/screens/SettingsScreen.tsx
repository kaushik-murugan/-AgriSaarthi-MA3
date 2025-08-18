import React, { useState, useContext, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, Switch, TouchableOpacity, Modal, Button, Linking, Alert, TextInput } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { useLocalization } from '../context/LanguageContext';
import ScreenWrapper from '../components/ScreenWrapper';
import * as Location from 'expo-location';

export default function SettingsScreen() {
  const [voice, setVoice] = useState(false);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { t, setLanguage, language } = useLocalization();
  const [modalVisible, setModalVisible] = useState(false);
  const [farmerName, setFarmerName] = useState('John Doe'); // Initial farmer name
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const backgroundCard = isDark ? '#1E1E1E' : '#FFF';
  const textColor = isDark ? '#FFF' : '#111';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('permission_needed'), t('location_permission_denied'));
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(`Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`);
    })();
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  const handleEditFarmerName = () => {
    console.log('handleEditFarmerName triggered');
    Alert.prompt(
      t('farmer_name'),
      t('enter_farmer_name'),
      [
        {
          text: t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('update_name'),
          onPress: (name) => {
            console.log('Update Name pressed, name:', name);
            name && setFarmerName(name);
          },
        },
      ],
      'plain-text',
      farmerName
    );
  };

  const handleSetLocation = async () => {
    console.log('handleSetLocation triggered');
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log('Location permission status in handleSetLocation:', status);
    if (status !== 'granted') {
      Alert.alert(t('permission_needed'), t('location_permission_denied'));
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      console.log('Location data in handleSetLocation:', location);
      setCurrentLocation(`Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`);
      Alert.alert(t('current_location'), `Lat: ${location.coords.latitude.toFixed(4)}, Lon: ${location.coords.longitude.toFixed(4)}`);
    } catch (e) {
      console.error('Error getting location in handleSetLocation:', e);
      Alert.alert(t('error'), t('failed_to_get_location'));
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView style={{ padding: 16 }}>
        <Text style={[styles.header, { color: isDark ? '#A7F3D0' : '#047857' }]}>
          {t('customize_your_experience')}
        </Text>
        <View style={[styles.section, { backgroundColor: backgroundCard }]}>
          <SettingRow label={t('farmer_name')} value={farmerName} action={t('edit')} onPress={handleEditFarmerName} textColor={textColor} />
          <SettingRow label={t('location')} value={currentLocation} action={t('set_location')} onPress={handleSetLocation} textColor={textColor} />
          <SettingRow label={t('language_region')} action={t('choose_language')} onPress={() => setModalVisible(true)} textColor={textColor} />
          <Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>{t(language === 'en' ? 'english_lang' : language === 'hi' ? 'hindi_lang' : language === 'ta' ? 'tamil_lang' : 'kannada_lang')}</Text>
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
              <Button title={t('english_lang')} onPress={() => changeLanguage('en')} />
              <Button title={t('hindi_lang')} onPress={() => changeLanguage('hi')} />
              <Button title={t('tamil_lang')} onPress={() => changeLanguage('ta')} />
              <Button title={t('kannada_lang')} onPress={() => changeLanguage('ka')} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenWrapper>
  );
}

const SettingRow = ({ label, value, action, onPress, textColor }: any) => {
  const content = (
    <View style={styles.row}>
      <Text style={{ color: textColor }}>{label}</Text>
      {value && <Text style={{ color: textColor, marginRight: 10 }}>{value}</Text>}
      {action && (
        <Text style={{ color: '#047857' }}>{action}</Text>
      )}
    </View>
  );

  return onPress ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content;
};

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