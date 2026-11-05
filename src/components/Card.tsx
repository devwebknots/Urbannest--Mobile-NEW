/**
 * Global Dumb Component: Card
 * Pure presentation container for grouping related content with elevation/border.
 */

import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '@/config/theme';

export interface CardProps {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly elevation?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'md',
}) => {
  const shadowStyle = elevation === 'none' ? null : shadows[elevation];

  return (
    <View style={[styles.card, shadowStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});

export default Card;
