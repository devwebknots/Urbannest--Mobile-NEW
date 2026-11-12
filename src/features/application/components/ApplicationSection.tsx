/**
 * ApplicationSection: one block of the rental application ("Primary
 * Applicant Identity", "Residential Address", ...), laid on the page like
 * the Property Details sections (no card): the shared
 * `PropertySectionTitle` (soft blue icon circle + `sectionHeading` navy),
 * an optional `cardSubtitle` line under the title, then the fields.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import {
  PropertySectionTitle,
  SECTION_BADGE,
} from '@/features/guest/components/property/PropertySectionTitle';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationIconName } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

interface Props {
  icon: ApplicationIconName;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ApplicationSection: React.FC<Props> = ({ icon, title, subtitle, children }) => (
  <View>
    <PropertySectionTitle
      title={title}
      iconElement={<ApplicationIcon name={icon} size={ms(18)} color={colors.primary} />}
    />
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    <View style={styles.body}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  // Lines up with the title, past the icon circle
  subtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
    marginLeft: SECTION_BADGE + spacing.md,
  },
  body: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
});

export default ApplicationSection;
