/**
 * FormSelect: dropdown-style field (opens a sheet). Optional line icon on
 * the left, the chosen value or a grey placeholder, chevron on the right.
 */

import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { ChevronDownIcon } from '@/components/icons';
import { colors, spacing } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon, RenterIconName } from '../dashboard/RenterIcon';
import { formStyles } from './formStyles';

interface Props {
  value?: string;
  placeholder: string;
  icon?: RenterIconName;
  onPress: () => void;
  accessibilityLabel: string;
}

export const FormSelect: React.FC<Props> = ({ value, placeholder, icon, onPress, accessibilityLabel }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={value ? `${accessibilityLabel}, ${value}` : accessibilityLabel}
    style={({ pressed }) => [formStyles.field, styles.row, pressed && styles.pressed]}
  >
    {icon ? <RenterIcon name={icon} size={ms(20)} color={colors.navy} /> : null}
    <Text style={[formStyles.input, styles.value, !value && formStyles.placeholder]} numberOfLines={1}>
      {value ?? placeholder}
    </Text>
    <ChevronDownIcon size={ms(14)} color={colors.navy} />
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  value: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default FormSelect;
