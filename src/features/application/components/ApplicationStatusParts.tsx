/**
 * Application Status page pieces:
 *  - StatusFilterChips: side-scrolling filter chips with counts ("Draft (1)").
 *    Active = navy gradient (button colours) with white text; others white
 *    with a pale blue rim and a navy line icon. Pills (chips may be pills).
 *  - ApplicationStatusCard: light card (white, radius 16, hairline border,
 *    `shadows.sm`): building photo, `listingTitle` name, `cardSubtitle`
 *    unit line, status pill, chevron; under a hairline: "Applied On" date
 *    and application ID with line icons.
 *  - StatusPill: app status colours (as on Maintenance tickets).
 */

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { APPLICATION_STATUS_META } from '../constants';
import type {
  ApplicationFilterId,
  ApplicationIconName,
  ApplicationRecord,
  ApplicationStatusId,
} from '../types';
import { ApplicationIcon } from './ApplicationIcon';

const ACCENT = {
  grey: { bg: colors.surfaceMuted, fg: colors.textSecondary },
  blue: { bg: colors.infoLight, fg: colors.primary },
  green: { bg: colors.successLight, fg: colors.successDark },
  amber: { bg: colors.warningLight, fg: colors.warningDark },
  red: { bg: colors.errorLight, fg: colors.error },
} as const;

export const StatusPill: React.FC<{
  status: ApplicationStatusId;
  /** e.g. drop the top margin when the pill sits beside a title */
  style?: StyleProp<ViewStyle>;
}> = ({ status, style }) => {
  const meta = APPLICATION_STATUS_META[status];
  const tone = ACCENT[meta.accent];
  return (
    <View style={[styles.pill, { backgroundColor: tone.bg }, style]}>
      <ApplicationIcon name={meta.icon} size={ms(13)} color={tone.fg} />
      <Text style={[styles.pillText, { color: tone.fg }]} numberOfLines={1}>
        {meta.label.replace('\n', ' ')}
      </Text>
    </View>
  );
};

export const StatusFilterChips: React.FC<{
  filters: readonly { id: ApplicationFilterId; label: string; icon?: ApplicationIconName }[];
  value: ApplicationFilterId;
  counts: Record<ApplicationFilterId, number>;
  onChange: (id: ApplicationFilterId) => void;
}> = ({ filters, value, counts, onChange }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.chips}
    accessibilityRole="tablist"
  >
    {filters.map(f => {
      const on = f.id === value;
      return (
        <Pressable
          key={f.id}
          onPress={() => onChange(f.id)}
          accessibilityRole="tab"
          accessibilityState={{ selected: on }}
          accessibilityLabel={`${f.label}, ${counts[f.id]}`}
          style={({ pressed }) => [styles.chip, on && styles.chipOn, pressed && styles.pressed]}
        >
          {f.icon ? (
            <ApplicationIcon name={f.icon} size={ms(15)} color={on ? colors.white : colors.navy} />
          ) : null}
          <Text style={[styles.chipText, on && styles.chipTextOn]}>
            {`${f.label} (${counts[f.id]})`}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const Meta: React.FC<{ icon: ApplicationIconName; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={styles.meta}>
    <ApplicationIcon name={icon} size={ms(16)} color={colors.navy} />
    <View>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  </View>
);

export const ApplicationStatusCard: React.FC<{
  record: ApplicationRecord;
  onPress: () => void;
}> = ({ record, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${record.propertyName}, ${APPLICATION_STATUS_META[record.status].label.replace('\n', ' ')}`}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <View style={styles.top}>
      <Image source={record.image} style={styles.photo} resizeMode="cover" />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {record.propertyName}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {record.unit}
        </Text>
        <StatusPill status={record.status} />
      </View>
      <ChevronRightIcon size={ms(14)} color={colors.navy} />
    </View>
    <View style={styles.bottom}>
      <Meta icon="calendar" label="Applied On" value={record.appliedOn} />
      <View style={styles.metaDivider} />
      <Meta icon="layers" label="ID" value={record.id} />
    </View>
  </Pressable>
);

const PHOTO = ms(84);

const styles = StyleSheet.create({
  chips: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenHorizontal,
    // Room for the active chip's shadow
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    height: ms(40),
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  chipOn: {
    borderColor: 'transparent',
    backgroundImage: `linear-gradient(120deg, ${colors.buttonGradientStart} 0%, ${colors.buttonGradientEnd} 100%)`,
  },
  chipText: {
    ...typographyPresets.segmentLabel,
    color: colors.navy,
  },
  chipTextOn: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.75,
  },
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: borderRadius.lg,
  },
  text: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    ...typographyPresets.listingTitle,
    color: colors.navy,
  },
  unit: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(2),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
  },
  pillText: {
    ...typographyPresets.badge,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: spacing.md,
    backgroundColor: TILE_BORDER,
  },
  metaLabel: {
    ...typographyPresets.caption,
    color: colors.textSecondary,
  },
  metaValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
});
