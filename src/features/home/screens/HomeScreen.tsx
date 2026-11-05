import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '@/config/theme';

export const HomeScreen: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.title}>UrbanNest</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontFamily: typography.fontFamily.heading.bold, fontSize: typography.fontSize.display, color: colors.textPrimary },
});

export default HomeScreen;
