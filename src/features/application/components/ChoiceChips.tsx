/**
 * ChoiceChips: single-choice chips that wrap onto lines (relationship, pet
 * type). Field-blue tiles, navy `bodyMedium` text; the picked one only gets
 * a soft secondary-blue tick (no stroke / fill change, app selection rule).
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  options: readonly string[];
  value?: string;
  onChange: (value: string) => void;
}

export const ChoiceChips: React.FC<Props> = ({ options, value, onChange }) => (
  <View style={styles.chips}>
    {options.map(o => {
      const on = o === value;
      return (
        <Pressable
          key={o}
          onPress={() => onChange(o)}
          accessibilityRole="radio"
          accessibilityState={{ selected: on }}
          accessibilityLabel={o}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
        >
          {on ? (
            <View style={styles.tick}>
              <RenterIcon name="check" size={ms(9)} color={colors.white} />
            </View>
          ) : null}
          <Text style={styles.chipText}>{o}</Text>
        </Pressable>
      );
    })}
  </View>
);

const TICK = ms(16);

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    minHeight: ms(38),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  chipText: {
    ...typographyPresets.bodyMedium,
    color: colors.navy,
  },
  tick: {
    width: TICK,
    height: TICK,
    borderRadius: TICK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default ChoiceChips;
