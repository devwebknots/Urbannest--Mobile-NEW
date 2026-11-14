/**
 * PersonaCta: the white continue button of the persona pages, with a small
 * navy arrow disc after the label. Used by PersonaSelect and AddPersona.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';

interface Props {
  label: string;
  width: number;
  onPress: () => void;
}

export const PersonaCta: React.FC<Props> = ({ label, width, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.cta, { width }, pressed && styles.pressed]}
  >
    <Text style={styles.text} numberOfLines={1}>
      {label}
    </Text>
    <View style={styles.arrow}>
      <ChevronRightIcon size={14} color={colors.white} />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  cta: {
    height: 56,
    borderRadius: borderRadius.button,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.lg,
    color: colors.headerDarkBlue,
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  arrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginLeft: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerDarkBlue,
  },
});

export default PersonaCta;
