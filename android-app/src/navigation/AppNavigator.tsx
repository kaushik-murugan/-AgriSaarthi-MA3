import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import FarmToolsScreen from '../screens/FarmToolsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WeatherScreen from '../screens/WeatherScreen';
import { Ionicons } from '@expo/vector-icons';
import MarketPricesScreen from '../screens/MarketPricesScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Chat') iconName = 'chatbubble-ellipses';
            else if (route.name === 'Market') iconName = 'trending-up'; // Added icon for Market
            else if (route.name === 'Farm Tools') iconName = 'leaf';
            else if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#047857',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Market" component={MarketPricesScreen} />
        <Tab.Screen name="Farm Tools" component={FarmToolsScreen} />
        <Tab.Screen name="Weather" component={WeatherScreen}/>
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
