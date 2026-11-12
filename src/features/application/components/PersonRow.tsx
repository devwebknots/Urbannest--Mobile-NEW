/**
 * PersonRow: one co-applicant or dependent in the rental application:
 * round avatar (initial letter, or a line person icon), `cardTitle` name,
 * `caption` line (email / relationship) and an optional right slot
 * (status pill or edit button). Pale field-blue strip, radius 12.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import type { ApplicationIconName } from '../types';
import { ApplicationIcon } from './ApplicationIcon';

interface Props {
  name: string;
  detail: string;
  /** Show the first letter instead of the icon */
  initial?: boolean;
  /** Avatar icon (default: person); e.g. house for a residence row */
  icon?: ApplicationIconName;
  /** Lines for the detail text (default 1) */
  detailLines?: number;
  right?: React.ReactNode;
}

export const PersonRow: React.FC<Props> = ({
  name,
  detail,
  initial,
  icon = 'user',
  detailLines = 1,
  right,
}) => (
  <View style={styles.row}>
    <View style={[styles.avatar, initial && styles.avatarInitial]}>
      {initial ? (
        <Text style={styles.initial}>{name.trim().charAt(0).toUpperCase()}</Text>
      ) : (
        <ApplicationIcon name={icon} size={ms(20)} color={colors.navy} />
      )}
    </View>
    <View style={styles.text}>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.detail} numberOfLines={detailLines}>
        {detail}
      </Text>
    </View>
    {right}
  </View>
);

/** "✓ Invite Sent" pill (done = soft secondary blue, per the app's done colour) */
export const InviteSentPill: React.FC = () => (
  <View style={styles.pill}>
    <ApplicationIcon name="circleCheck" size={ms(14)} color={colors.headerGradientEnd} />
    <Text style={styles.pillText}>Invite Sent</Text>
  </View>
);

/** Round pencil button that opens the edit sheet */
export const EditButton: React.FC<{ onPress: () => void; label: string }> = ({
  onPress,
  label,
}) => (
  <Pressable
    onPress={onPress}
    hitSlop={8}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.edit, pressed && styles.pressed]}
  >
    <ApplicationIcon name="pencil" size={ms(16)} color={colors.navy} />
  </Pressable>
);

const AVATAR = ms(40);
const EDIT = ms(34);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarInitial: {
    backgroundColor: colors.chipBlue,
  },
  initial: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  text: {
    flex: 1,
  },
  name: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  detail: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  edit: {
    width: EDIT,
    height: EDIT,
    borderRadius: EDIT / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  pressed: {
    opacity: 0.6,
  },
});

export default PersonRow;
