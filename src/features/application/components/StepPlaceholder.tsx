/**
 * StepPlaceholder: content for application steps that aren't built yet
 * (History, Documents, Submission): a soft blue icon circle, the step name
 * and a short "coming soon" line, centered on the page (no card).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationStep } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

export const StepPlaceholder: React.FC<{ step: ApplicationStep }> = ({ step }) => (
  <View style={styles.wrap}>
    <View style={styles.circle}>
      <ApplicationIcon name={step.icon} size={ms(30)} color={colors.primary} />
    </View>
    <Text style={styles.title}>{step.label}</Text>
    <Text style={styles.text}>
      This step is coming soon. Use the steps above or the button below to move through the
      application.
    </Text>
  </View>
);

const CIRCLE = ms(76);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
    borderWidth: 3,
    borderColor: colors.white,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.lg,
    color: colors.navy,
    textAlign: 'center',
  },
  text: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default StepPlaceholder;
