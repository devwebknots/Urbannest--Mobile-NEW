/**
 * ApplicationSection: one block of the rental application ("Primary
 * Applicant Identity", "Residential Address", ...), laid on the page (no
 * card, no icon): title in `sectionHeading` navy, an optional one-line
 * `cardSubtitle` in “quotes” (slanted), then the fields.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';

interface Props {
  title: string;
  subtitle?: string;
  /** Beside the title + subtitle, e.g. an upload progress ring */
  right?: React.ReactNode;
  children: React.ReactNode;
}

export const ApplicationSection: React.FC<Props> = ({ title, subtitle, right, children }) => (
  <View>
    <View style={styles.head}>
      <View style={styles.headText}>
        <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
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
