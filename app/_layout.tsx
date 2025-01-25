import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../global.css";
import { DatabaseProvider } from '@/components/storage/DatabaseProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar, Platform } from 'react-native';

enableScreens(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  interface ScreenOptions {
    headerShown: boolean;
    gestureDirection: 'horizontal' | 'vertical';
    animation: 'slide_from_left' | 'slide_from_bottom' | 'slide_from_right';
  }

  const getScreenOptions = (routeName: string): ScreenOptions => {
    switch (routeName) {
      case 'menu':
        return {
          headerShown: false,
          gestureDirection: 'horizontal',
          animation: 'slide_from_left',
        };
      case 'index':
        return {
          headerShown: false,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
        };
      default:
        return {
          headerShown: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_left',
        };
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack 
              screenOptions = {({ route }) => ({
                gestureEnabled: true,
                animationTypeForReplace: 'push',
                ...getScreenOptions(route.name),
              })}
            >

            <Stack.Screen name="menu" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />


          </Stack>
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}