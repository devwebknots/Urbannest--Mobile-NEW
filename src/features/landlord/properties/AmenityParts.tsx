/**
 * Add New Property → Amenities tab pieces (layout from the "Property
 * Amenities" design, in the app's own tokens):
 *  - AmenityIcon: amenity line icon (tinted PNG)
 *  - AmenitySearch: "Search amenities..." field (form field look)
 *  - AmenityGrid: 4-column tiles (icon, label, checkbox top right)
 *  - AmenityAccessList: selected shared amenities, one row each (icon tile,
 *    name, "Provide access to the … for units/tenants.", checkbox)
 *  - InfoNote: (i) + one grey line under the section
 * Selected state follows the app rule: no stroke / fill change on the
 * card, a filled secondary-blue checkbox and a blue icon instead.
 */

import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { formStyles } from '@/features/renter/components/form/formStyles';
import { moderateScale as ms } from '@/utils/responsive';
import { type AmenityIconName, amenityIcons } from '../assets/landlordAssets';
import type { PropertyAmenity } from './constants';

const COLUMNS = 4;
const GAP = spacing.sm;

export const AmenityIcon: React.FC<{ name: AmenityIconName; size: number; color: string }> = ({
  name,
  size,
  color,
}) => (
  <Image
    source={amenityIcons[name]}
    style={{ width: size, height: size, tintColor: color }}
    resizeMode="contain"
  />
);

/** Square checkbox: white with a line border, or filled done-blue + tick */
const CheckBox: React.FC<{ on: boolean }> = ({ on }) => (
  <View style={[styles.box, on && styles.boxOn]}>
    {on ? <RenterIcon name="check" size={ms(10)} color={colors.white} /> : null}
  </View>
);

export const AmenitySearch: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => (
  <View style={[formStyles.field, styles.search]}>
    <AmenityIcon name="search" size={ms(18)} color={colors.textSecondary} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search amenities..."
      placeholderTextColor={colors.textMuted}
      autoCorrect={false}
      returnKeyType="search"
      accessibilityLabel="Search amenities"
      style={[formStyles.input, styles.searchInput]}
    />
  </View>
);

export const AmenityGrid: React.FC<{
  amenities: readonly PropertyAmenity[];
  selected: readonly string[];
  onToggle: (id: string) => void;
}> = ({ amenities, selected, onToggle }) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const tileW = width > 0 ? Math.floor((width - GAP * (COLUMNS - 1)) / COLUMNS) : 0;

  return (
    <View style={styles.grid} onLayout={onLayout}>
      {amenities.length === 0 ? (
        <Text style={styles.empty}>No amenities match your search.</Text>
      ) : null}
      {tileW > 0
        ? amenities.map(a => {
            const on = selected.includes(a.id);
            return (
              <Pressable
                key={a.id}
                onPress={() => onToggle(a.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                accessibilityLabel={a.label}
                style={({ pressed }) => [styles.tile, { width: tileW }, pressed && styles.pressed]}
              >
                <View style={styles.tileCheck}>
                  <CheckBox on={on} />
                </View>
                <AmenityIcon
                  name={a.icon}
                  size={ms(26)}
                  color={on ? colors.primary : colors.navy}
                />
                <Text style={styles.tileLabel} numberOfLines={2}>
                  {a.label}
                </Text>
              </Pressable>
            );
          })
        : null}
    </View>
  );
};

export const AmenityAccessList: React.FC<{
  amenities: readonly PropertyAmenity[];
  granted: readonly string[];
  onToggle: (id: string) => void;
}> = ({ amenities, granted, onToggle }) =>
  amenities.length === 0 ? (
    <View style={styles.accessEmpty}>
      <Text style={styles.empty}>
        Select shared amenities above (gym, elevator, garden…) to grant access.
      </Text>
    </View>
  ) : (
    <View style={styles.accessList}>
      {amenities.map((a, i) => {
        const on = granted.includes(a.id);
        return (
          <Pressable
            key={a.id}
            onPress={() => onToggle(a.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`Access to ${a.label}`}
            style={({ pressed }) => [
              styles.accessRow,
              i > 0 && styles.accessDivider,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.accessIcon}>
              <AmenityIcon name={a.icon} size={ms(22)} color={colors.navy} />
            </View>
            <View style={styles.accessText}>
              <Text style={styles.accessTitle} numberOfLines={1}>
                {a.label}
              </Text>
              <Text style={styles.accessBody} numberOfLines={2}>
                {`Provide access to the ${a.accessName} for units/tenants.`}
              </Text>
            </View>
            <CheckBox on={on} />
          </Pressable>
        );
      })}
    </View>
  );

export const InfoNote: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.note}>
    <AmenityIcon name="info" size={ms(16)} color={colors.textSecondary} />
    <Text style={styles.noteText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  box: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
  },
  boxOn: {
    borderColor: DONE_BLUE,
    backgroundColor: DONE_BLUE,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  tile: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
  },
  tileCheck: {
    position: 'absolute',
    top: spacing.xs + 2,
    right: spacing.xs + 2,
  },
  tileLabel: {
    ...typographyPresets.cardSubtitle,
    // Two lines tall, so one- and two-line labels keep tiles even
    minHeight: (typographyPresets.cardSubtitle.lineHeight ?? ms(16)) * 2,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  empty: {
    ...typographyPresets.body,
    flex: 1,
    paddingVertical: spacing.md,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  accessEmpty: {
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: TILE_BORDER,
  },
  accessList: {
    overflow: 'hidden',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
  },
  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  accessDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  // Same secondary-blue wash as the section icon tiles
  accessIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.headerGradientEnd}1A`,
  },
  accessText: {
    flex: 1,
    gap: 2,
  },
  accessTitle: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  accessBody: {
    ...typographyPresets.cardSubtitle,
    color: colors.textSecondary,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noteText: {
    ...typographyPresets.cardSubtitle,
    flex: 1,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
