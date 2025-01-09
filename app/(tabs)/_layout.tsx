import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import "../../global.css";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Floating tab bar on iOS
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 10, // Shadow on Android
          },
          default: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 10,
          },
        }),
      }}
    >

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="user" size={size} color={color} />
            ),
          }}
      />
      
    </Tabs>
  );
}
