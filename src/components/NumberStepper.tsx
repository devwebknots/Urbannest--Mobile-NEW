/**
 * NumberStepper: "−  0  +" counter in the app's form field look (TILE_BG,
 * TILE_BORDER, field height). The minus / plus fade out at the limits.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PlusIcon } from '@/components/icons';
import { colors, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { formStyles } from '@/features/renter/components/form/formStyles';
import { moderateScale as ms } from '@/utils/responsive';

export const NumberStepper: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  accessibilityLabel: string;
}> = ({ value, onChange, min = 0, max, accessibilityLabel }) => {
  const canDown = value > min;
  const canUp = value < max;
  return (
    <View
      style={[formStyles.field, styles.box]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={e => {
        if (e.nativeEvent.actionName === 'increment' && canUp) {
          onChange(value + 1);
        } else if (e.nativeEvent.actionName === 'decrement' && canDown) {
          onChange(value - 1);
        }
      }}
    >
      <Pressable
        onPress={() => canDown && onChange(value - 1)}
        disabled={!canDown}
        hitSlop={4}
        accessibilityLabel={`Decrease ${accessibilityLabel}`}
        style={({ pressed }) => [styles.btn, !canDown && styles.off, pressed && styles.pressed]}
      >
        <View style={styles.minus} />
      </Pressable>
      <View style={styles.rule} />
      <Text style={styles.value}>{value}</Text>
      <View style={styles.rule} />
      <Pressable
        onPress={() => canUp && onChange(value + 1)}
        disabled={!canUp}
        hitSlop={4}
        accessibilityLabel={`Increase ${accessibilityLabel}`}
        style={({ pressed }) => [styles.btn, !canUp && styles.off, pressed && styles.pressed]}
      >
        <PlusIcon size={ms(14)} color={colors.navy} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  btn: {
    width: ms(42),
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    width: ms(12),
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.navy,
  },
  rule: {
    width: 1,
    backgroundColor: TILE_BORDER,
  },
  value: {
    ...typographyPresets.bodyMedium,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  off: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.6,
  },
});
