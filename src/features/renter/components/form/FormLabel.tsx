/**
 * FormLabel: form sub-heading with a navy line icon on the left, e.g.
 * "⚠ Problem", in the `formHeading` preset (Playfair Medium 15, navy).
 * Optional "(optional)" note after the text.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon, RenterIconName } from '../dashboard/RenterIcon';

interface Props {
  icon: RenterIconName;
  label: string;
  optional?: boolean;
}

export const FormLabel: React.FC<Props> = ({ icon, label, optional }) => (
  <View style={styles.row}>
    <RenterIcon name={icon} size={ms(20)} color={colors.navy} />
    <Text style={styles.label} accessibilityRole="header">
      {label}
      {optional ? <Text style={styles.optional}> (optional)</Text> : null}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  // Playfair like the other screens' sub-headings, at form size (15)
  label: {
    ...typographyPresets.formHeading,
    flexShrink: 1,
  },
  optional: {
    ...typographyPresets.cardSubtitle,
  },
});

export default FormLabel;
