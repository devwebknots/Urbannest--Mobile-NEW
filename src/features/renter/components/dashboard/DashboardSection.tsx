/**
 * DashboardSection: Playfair title + subtitle, gold "Explore All ->" link,
 * then the section body.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';

interface Props {
  title: string;
  subtitle: string;
  onExplore?: () => void;
  children: React.ReactNode;
}

export const DashboardSection: React.FC<Props> = ({ title, subtitle, onExplore, children }) => (
  <View style={styles.root}>
    <View style={styles.head}>
      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {onExplore ? (
        <Pressable
          onPress={onExplore}
          hitSlop={10}
          style={styles.link}
          accessibilityRole="button"
          accessibilityLabel={`Explore all ${title}`}
        >
          <Text style={styles.linkText}>Explore All</Text>
          <ArrowRightIcon size={ms(14)} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    marginTop: spacing.sectionGap,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenHorizontal,
  },
  titles: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.heading.bold,
    fontSize: scaleFont(22),
    lineHeight: scaleFont(29),
    color: colors.navy,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(19),
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    marginTop: ms(6),
  },
  linkText: {
    ...typographyPresets.sectionLink,
    fontFamily: typography.fontFamily.body.semiBold,
  },
  body: {
    marginTop: spacing.lg,
  },
});

export default DashboardSection;
