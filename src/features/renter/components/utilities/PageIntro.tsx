/**
 * PageIntro: the title block at the top of the light utilities pages:
 * small eyebrow, Playfair title (heroTitle, the app's page heading preset, navy), a short navy
 * accent rule and an intro line.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  /** Optional small line above the title */
  eyebrow?: string;
  title: string;
  body: string;
}

export const PageIntro: React.FC<Props> = ({ eyebrow, title, body }) => (
  <View style={styles.wrap}>
    {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
    <Text style={[styles.title, !eyebrow && styles.titleAlone]}>{title}</Text>
    <View style={styles.rule} />
    <Text style={styles.body}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.screenHorizontal,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.secondary,
  },
  // Page heading preset (same as My Residences / guest hero titles), navy on the light page
  title: {
    ...typographyPresets.heroTitle,
    marginTop: spacing.sm,
    color: colors.navy,
  },
  titleAlone: {
    marginTop: 0,
  },
  rule: {
    width: ms(36),
    height: 3,
    marginTop: spacing.md,
    borderRadius: 2,
    backgroundColor: colors.navy,
  },
  body: {
    ...typographyPresets.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});

export default PageIntro;
