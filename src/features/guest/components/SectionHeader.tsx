/**
 * Section headings used across the guest home page.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDownIcon, ChevronRightIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

/** Centered: — EYEBROW — / title / description */
export const CenteredHeader: React.FC<{
  eyebrow: string;
  title: string;
  description?: string;
}> = ({ eyebrow, title, description }) => (
  <View style={styles.centered}>
    <View style={styles.eyebrowRow}>
      <View style={styles.rule} />
      <Text style={typographyPresets.eyebrow}>{eyebrow}</Text>
      <View style={styles.rule} />
    </View>
    <Text style={[typographyPresets.displayTitle, styles.centeredTitle]}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
  </View>
);

/** Left title + subtitle with an optional action pill on the right. */
export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; variant: 'dropdown' | 'link'; onPress?: () => void };
}> = ({ eyebrow, title, subtitle, action }) => (
  <View style={styles.row}>
    <View style={styles.flex}>
      {eyebrow ? <Text style={[typographyPresets.eyebrow, styles.leftEyebrow]}>{eyebrow}</Text> : null}
      <Text style={typographyPresets.sectionHeading}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {action ? (
      <Pressable
        onPress={action.onPress}
        style={[styles.action, action.variant === 'link' && styles.actionLink]}
        accessibilityRole="button"
      >
        <Text style={styles.actionText}>{action.label}</Text>
        {action.variant === 'dropdown' ? (
          <ChevronDownIcon size={ms(12)} color={colors.textSecondary} />
        ) : (
          <ChevronRightIcon size={ms(12)} color={colors.textPrimary} />
        )}
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rule: {
    width: ms(22),
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: colors.textSubtle,
  },
  centeredTitle: {
    marginTop: spacing.sm,
  },
  description: {
    ...typographyPresets.sectionDescription,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenHorizontal,
  },
  flex: { flex: 1, paddingRight: spacing.md },
  leftEyebrow: {
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionLink: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: ms(8),
    borderRadius: borderRadius.button,
    borderColor: colors.textSubtle,
    backgroundColor: 'transparent',
  },
  actionText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
});
