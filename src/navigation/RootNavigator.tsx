/**
 * Root Application Navigator (native stack).
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/features/home';
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
        options={{ gestureEnabled: false, animation: 'none' }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default RootNavigator;
