import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import ResProvider from './Provider/ResProvider';
import AuthProvider from './Provider/AuthProvider';
import QueryProvider from './Provider/QueryProvider';
import UserProvider from './Provider/UserProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
      <UserProvider>
      <QueryProvider>
      <ResProvider>
        <Stack>
        <Stack.Screen name="index" options={{ presentation: 'modal' }} />
        <Stack.Screen name="Admins" options={{ headerShown:false}} />
        <Stack.Screen name="USER" options={{ headerShown:false }} />
         <Stack.Screen name="Auth" options={{ headerShown:false }} />
        </Stack>
      </ResProvider>
      </QueryProvider>
      </UserProvider>
      </AuthProvider>
      
    </ThemeProvider>
  );
}
