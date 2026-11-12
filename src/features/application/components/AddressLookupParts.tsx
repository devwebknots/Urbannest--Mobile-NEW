/**
 * Address lookup pieces for the rental application address fields:
 *  - CurrentLocationButton: small "◎ Use current location" text action
 *    (`sectionLink` blue), with a spinner while locating
 *  - AddressSuggestions: address suggestions under Street Address 1, in a
 *    white strip with hairline rows (pin, street in navy, area in grey)
 *    and the "© OpenStreetMap" data credit
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import type { AddressSuggestion } from '@/services/places/addressSearch';
import { moderateScale as ms } from '@/utils/responsive';
import { ApplicationIcon } from './ApplicationIcon';

export const CurrentLocationButton: React.FC<{ onPress: () => void; loading: boolean }> = ({
  onPress,
  loading,
}) => (
  <Pressable
    onPress={onPress}
    disabled={loading}
    hitSlop={10}
    accessibilityRole="button"
    accessibilityLabel="Use current location"
    accessibilityState={{ busy: loading }}
    style={({ pressed }) => [styles.locate, pressed && styles.pressed]}
  >
    {loading ? (
      <ActivityIndicator size="small" color={colors.primary} />
    ) : (
      <ApplicationIcon name="locate" size={ms(14)} color={colors.primary} />
    )}
    <Text style={styles.locateText}>{loading ? 'Locating…' : 'Use current location'}</Text>
  </Pressable>
);

export const AddressSuggestions: React.FC<{
  suggestions: readonly AddressSuggestion[];
  onSelect: (s: AddressSuggestion) => void;
}> = ({ suggestions, onSelect }) =>
  suggestions.length === 0 ? null : (
    <View style={styles.list} accessibilityRole="list">
      {suggestions.map((s, i) => (
        <Pressable
          key={s.id}
          onPress={() => onSelect(s)}
          accessibilityRole="button"
          accessibilityLabel={`${s.main}, ${s.secondary}`}
          style={({ pressed }) => [styles.row, i > 0 && styles.rowDivider, pressed && styles.rowPressed]}
        >
          <ApplicationIcon name="mapPin" size={ms(16)} color={colors.navy} />
          <View style={styles.rowText}>
            <Text style={styles.main} numberOfLines={1}>
              {s.main}
            </Text>
            {s.secondary ? (
              <Text style={styles.secondary} numberOfLines={1}>
                {s.secondary}
              </Text>
            ) : null}
          </View>
        </Pressable>
      ))}
      <Text style={styles.powered}>© OpenStreetMap</Text>
    </View>
  );

const styles = StyleSheet.create({
  locate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locateText: {
    ...typographyPresets.sectionLink,
    color: colors.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  list: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  rowPressed: {
    backgroundColor: colors.chipBlue,
  },
  rowText: {
    flex: 1,
  },
  main: {
    ...typographyPresets.bodyMedium,
    color: colors.navy,
  },
  secondary: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  powered: {
    ...typographyPresets.caption,
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    color: colors.textMuted,
  },
});
