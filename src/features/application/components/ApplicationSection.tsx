/**
 * ApplicationSection: one block of the rental application ("Primary
 * Applicant Identity", "Residential Address", ...), laid on the page (no
 * card, no icon): title in `sectionHeading` navy, an optional one-line
 * `cardSubtitle` in “quotes” (slanted), then the fields.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationIconName } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

interface Props {
  title: string;
  subtitle?: string;
  /**
   * Optional line icon (primary blue) in a secondary-blue tile before the
   * title (landlord pages): an application icon name, or any icon element
   * (e.g. a video camera)
   */
  icon?: ApplicationIconName | React.ReactElement;
  /** Beside the title + subtitle, e.g. an upload progress ring */
  right?: React.ReactNode;
  children: React.ReactNode;
}

export const ApplicationSection: React.FC<Props> = ({ title, subtitle, icon, right, children }) => (
  <View>
    <View style={styles.head}>
      {icon ? (
        <View style={styles.iconTile}>
          {typeof icon === 'string' ? (
            <ApplicationIcon name={icon} size={ms(22)} color={colors.primary} />
          ) : (
            icon
          )}
        </View>
      ) : null}
      <View style={styles.headText}>
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {`“${subtitle}”`}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headText: {
    flex: 1,
  },
  iconTile: {
    width: ms(46),
    height: ms(46),
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    // Secondary blue (#518EF9) wash at ~14%
    backgroundColor: `${colors.headerGradientEnd}24`,
  },
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
    // Italic look: Inter has no italic file, so slant it (app rule, like heroAccent)
    transform: [{ skewX: '-10deg' }],
  },
  body: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
});

export default ApplicationSection;
