/**
 * Form pieces for the rental application, on the shared renter form look
 * (`formStyles.field`: soft blue-white fill, pale blue edge, radius 12):
 *  - LabeledField: "Legal First Name *" label (`fieldLabel`, red star when
 *    required) above any field, red `caption` error under it
 *  - FieldInput: text input with optional line icon left / right
 *  - PhoneField: flag + chevron country button, divider, number input
 *  - FieldRow: puts fields side by side (flex weights per field)
 */

import React from 'react';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { ChevronDownIcon } from '@/components/icons';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { formStyles } from '@/features/renter/components/form/formStyles';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationIconName, PhoneCountry } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

const ICON = ms(18);

export const LabeledField: React.FC<{
  label: string;
  required?: boolean;
  /** Light note after the label, e.g. "(blank if current)" */
  hint?: string;
  error?: string;
  /** Small action at the right of the label, e.g. "Use current location" */
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ label, required, hint, error, action, style, children }) => (
  <View style={style}>
    <View style={styles.labelRow}>
      <Text style={[styles.label, styles.labelText]} numberOfLines={1}>
        {label}
        {required ? <Text style={styles.star}> *</Text> : null}
        {hint ? <Text style={styles.hint}> {hint}</Text> : null}
      </Text>
      {action ? <View style={styles.labelAction}>{action}</View> : null}
    </View>
    {children}
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

export const FieldRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={styles.row}>{children}</View>
);

interface FieldInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: ApplicationIconName;
  rightIcon?: ApplicationIconName;
  /** Text before the value, e.g. "$" */
  prefix?: string;
  /** Unit after the value behind a divider, e.g. "sq ft" */
  suffix?: string;
  invalid?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  maxLength?: number;
  accessibilityLabel: string;
  onFocus?: TextInputProps['onFocus'];
  onBlur?: TextInputProps['onBlur'];
  autoCorrect?: boolean;
  returnKeyType?: TextInputProps['returnKeyType'];
}

export const FieldInput: React.FC<FieldInputProps> = ({
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  invalid,
  placeholder,
  ...input
}) => (
  <View style={[formStyles.field, styles.box, invalid && styles.invalid]}>
    {leftIcon ? <ApplicationIcon name={leftIcon} size={ICON} color={colors.navy} /> : null}
    {prefix ? <Text style={[formStyles.input, styles.prefix]}>{prefix}</Text> : null}
    <TextInput
      {...input}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      style={[formStyles.input, styles.input]}
    />
    {rightIcon ? <ApplicationIcon name={rightIcon} size={ICON} color={colors.navy} /> : null}
    {suffix ? (
      <>
        <View style={styles.divider} />
        <Text style={styles.suffix}>{suffix}</Text>
      </>
    ) : null}
  </View>
);

export const PhoneField: React.FC<{
  country: PhoneCountry;
  value: string;
  onChangeText: (text: string) => void;
  onPickCountry: () => void;
  invalid?: boolean;
}> = ({ country, value, onChangeText, onPickCountry, invalid }) => (
  <View style={[formStyles.field, styles.box, styles.phone, invalid && styles.invalid]}>
    <Pressable
      onPress={onPickCountry}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={`Country code, ${country.label}`}
      style={({ pressed }) => [styles.country, pressed && styles.pressed]}
    >
      <Text style={styles.flag}>{country.flag}</Text>
      <ChevronDownIcon size={ms(12)} color={colors.navy} />
    </Pressable>
    <View style={styles.divider} />
    <Text style={[formStyles.input, styles.dial]}>{country.dialCode}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Mobile number"
      placeholderTextColor={colors.textMuted}
      keyboardType="phone-pad"
      autoComplete="tel"
      maxLength={16}
      accessibilityLabel="Mobile phone"
      style={[formStyles.input, styles.input]}
    />
  </View>
);

const styles = StyleSheet.create({
  label: {
    ...typographyPresets.fieldLabel,
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelText: {
    flexShrink: 1,
  },
  labelAction: {
    marginLeft: 'auto',
    paddingLeft: spacing.md,
  },
  star: {
    color: colors.error,
  },
  hint: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  prefix: {
    marginRight: -spacing.xs,
    color: colors.textSecondary,
  },
  suffix: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  error: {
    ...typographyPresets.caption,
    marginTop: spacing.xs,
    color: colors.error,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  invalid: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    minHeight: ms(48),
  },
  phone: {
    paddingLeft: spacing.md,
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  flag: {
    fontSize: ms(20),
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: spacing.sm,
    backgroundColor: TILE_BORDER,
  },
  dial: {
    marginRight: -spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
});
