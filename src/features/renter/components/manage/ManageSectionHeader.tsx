/**
 * ManageSectionHeader: section title on the Manage page. Optional line
 * icon on the left, title + subtitle, and a "See All →" text link on the
 * right (no pill border, like the premium dashboard design).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: { label: string; onPress: () => void };
}

export const ManageSectionHeader: React.FC<Props> = ({ title, subtitle, icon, action }) => (
  <View style={styles.row}>
    {icon ? <View style={styles.icon}>{icon}</View> : null}
    <View style={styles.flex}>
      <Text style={typographyPresets.sectionHeading} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {action ? (
      <Pressable
        onPress={action.onPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`${action.label} ${title}`}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Text style={styles.actionText}>{action.label}</Text>
        <ArrowRightIcon size={ms(13)} color={colors.navy} />
      </Pressable>
    ) : null}
  </View>
);

/** Size for the optional icon on the left */
export const SECTION_ICON = ms(24);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenHorizontal,
  },
  icon: {
    marginTop: ms(2),
    marginRight: spacing.md,
  },
  flex: {
    flex: 1,
    paddingRight: spacing.md,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginTop: ms(5),
  },
  pressed: {
    opacity: 0.6,
  },
  actionText: {
    ...typographyPresets.sectionLink,
    fontFamily: typography.fontFamily.body.semiBold,
    fontWeight: typography.fontWeight.semibold,
    color: colors.navy,
  },
});

export default ManageSectionHeader;
