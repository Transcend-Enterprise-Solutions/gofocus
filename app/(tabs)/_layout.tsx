import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function configureNavigation() {
      if (Platform.OS === 'android') {
        StatusBar.setHidden(true, 'slide');
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("swipe");
      }
    }

    configureNavigation();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            bottom: 10,
            backgroundColor: 'transparent',
          },
          default: {
            position: 'absolute',
            bottom: 25, 
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0, 
          },
        }),
      }}
    >

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="index"
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
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
      />
      
    </Tabs>
  );
}
