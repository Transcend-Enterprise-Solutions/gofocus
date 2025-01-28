import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

interface ScreenOptions {
  headerShown: boolean;
  gestureDirection: 'horizontal' | 'vertical';
  animation: 'slide_from_left' | 'slide_from_right';
}


const AuthLayout = () => {

  const slideFromLeftPage = [
    'sign_in',
  ]

  const getScreenOptions = (routeName: string): ScreenOptions => {
    if (slideFromLeftPage.includes(routeName)) {
      return {
        headerShown: false,
        gestureDirection: 'horizontal',
        animation: 'slide_from_left',
      };
    } else {
      return {
        headerShown: false,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      };
    }
  };
  
  return (
    <Stack
          screenOptions = {({ route }) => ({
            gestureEnabled: true,
            animationTypeForReplace: 'push',
            ...getScreenOptions(route.name),
          })}>

        <Stack.Screen name='sign_in' options={{ headerShown: false }} />
        <Stack.Screen name='sign_up' options={{ headerShown: false }} />

    </Stack>
  )
}

export default AuthLayout