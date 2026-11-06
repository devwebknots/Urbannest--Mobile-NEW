/**
 * Root Application Navigator (native stack).
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GuestHomeScreen } from '@/features/guest';
import { HomeScreen } from '@/features/home';
import { PersonaSelectScreen } from '@/features/persona';
import { RenterHomeScreen, ResidenceDashboardScreen } from '@/features/renter';
import { SplashScreen } from '@/features/splash';
import { LoginScreen } from '@/features/auth/screens/LoginScreen';
import { navigationRef } from './navigationRef';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          gestureEnabled: false,
          animation: 'none',
          // Let the native splash picture show through until JS draws its copy
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="GuestHome"
        component={GuestHomeScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="PersonaSelect"
        component={PersonaSelectScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="RenterHome"
        component={RenterHomeScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ResidenceDashboard"
        component={ResidenceDashboardScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
