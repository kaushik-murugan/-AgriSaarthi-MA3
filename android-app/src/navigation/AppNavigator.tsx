import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import FarmToolsScreen from '../screens/FarmToolsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WeatherScreen from '../screens/WeatherScreen';
import { Ionicons } from '@expo/vector-icons';
import MarketPricesScreen from '../screens/MarketPricesScreen';
import { ThemeContext } from '../context/ThemeContext';
import { useLocalization } from '../context/LanguageContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { isDark } = useContext(ThemeContext);
  const { t } = useLocalization();

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === t('home')) iconName = 'home';
            else if (route.name === t('chat')) iconName = 'chatbubble-ellipses';
            else if (route.name === t('market')) iconName = 'trending-up';
            else if (route.name === t('farm_tools')) iconName = 'leaf';
            else if (route.name === t('settings')) iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#047857',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name={t('home')} component={HomeScreen} />
        <Tab.Screen name={t('chat')} component={ChatScreen} />
        <Tab.Screen name={t('market')} component={MarketPricesScreen} />
        <Tab.Screen name={t('farm_tools')} component={FarmToolsScreen} />
        <Tab.Screen name={t('weather')} component={WeatherScreen}/>
        <Tab.Screen name={t('settings')} component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
