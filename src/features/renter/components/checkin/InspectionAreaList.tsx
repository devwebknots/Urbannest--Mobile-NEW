/**
 * InspectionAreaList: the move-in inspection checklist. Progress bar, then
 * the areas as a numbered timeline, then "Finalize Inspection".
 * Timeline: a rail on the left links step 1 -> N; a step's number turns
 * into a navy tick once checked and the line below it fills in. Each area
 * card shows its photo, name, what to check and a status pill
 * ("To check" / "Checked"). Tap a card to toggle it. Finalize is enabled
 * once every area is done.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { InspectionArea } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';
import { TILE_BORDER } from './CheckInChecklist';
import { ChecklistProgress } from './ChecklistProgress';

interface Props {
  areas: readonly InspectionArea[];
  confirmed: ReadonlySet<string>;
  done: number;
  total: number;
  canSubmit: boolean;
  onToggle: (area: InspectionArea) => void;
  onSubmit: () => void;
}

const PHOTO = ms(68);
const NODE = ms(28);
const CARD_PAD = spacing.md;
/** Centres the number on the card (card height = photo + padding) */
const NODE_TOP = CARD_PAD + (PHOTO - NODE) / 2;

const Step: React.FC<{
  area: InspectionArea;
  index: number;
  checked: boolean;
  /** Step above is checked: colours the line coming into this number */
  prevChecked: boolean;
  last: boolean;
  onPress: () => void;
}> = ({ area, index, checked, prevChecked, last, onPress }) => (
  <View style={styles.step}>
    <View style={styles.rail}>
      {/* Line from the step above into this number */}
      <View style={[styles.railTop, index > 0 && styles.line, prevChecked && styles.lineOn]} />
      <View style={[styles.node, checked && styles.nodeOn]}>
        {checked ? (
          <RenterIcon name="check" size={ms(11)} color={colors.white} />
        ) : (
          <Text style={styles.nodeText}>{index + 1}</Text>
        )}
      </View>
      {/* Line down to the next step */}
      {last ? null : <View style={[styles.lineDown, styles.line, checked && styles.lineOn]} />}
    </View>

    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={area.label}
      style={({ pressed }) => [styles.card, checked && styles.cardOn, pressed && styles.pressed]}
    >
      <Image source={area.image} style={styles.photo} resizeMode="cover" />
      <View style={styles.copy}>
        <Text style={styles.label} numberOfLines={1}>
          {area.label}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {area.hint}
        </Text>
        <View style={[styles.pill, checked && styles.pillOn]}>
          {checked ? <RenterIcon name="check" size={ms(9)} color={colors.white} /> : null}
          <Text style={[styles.pillText, checked && styles.pillTextOn]}>
            {checked ? 'Checked' : 'To check'}
          </Text>
        </View>
      </View>
    </Pressable>
  </View>
);

export const InspectionAreaList: React.FC<Props> = ({
  areas,
  confirmed,
  done,
  total,
  canSubmit,
  onToggle,
  onSubmit,
}) => {
  const remaining = total - done;
  return (
    <View style={styles.wrap}>
      <ChecklistProgress done={done} total={total} />

      <View style={styles.list}>
        {areas.map((area, i) => (
          <Step
            key={area.id}
            area={area}
            index={i}
            checked={confirmed.has(area.id)}
            prevChecked={i > 0 && confirmed.has(areas[i - 1].id)}
            last={i === areas.length - 1}
            onPress={() => onToggle(area)}
          />
        ))}
      </View>

      <Button
        title="Finalize Inspection"
        variant="brand"
        onPress={onSubmit}
        disabled={!canSubmit}
        rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
        style={styles.submit}
      />
      <Text style={styles.footnote}>
        {remaining > 0
          ? `Tap each area once checked. ${remaining} ${remaining === 1 ? 'area' : 'areas'} remaining.`
          : 'All areas checked. Finalize to complete your inspection.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  list: {
    marginTop: spacing.lg,
  },
  step: {
    flexDirection: 'row',
  },
  rail: {
    width: NODE,
    alignItems: 'center',
  },
  railTop: {
    height: NODE_TOP,
  },
  lineDown: {
    flex: 1,
  },
  line: {
    width: 2,
    backgroundColor: TILE_BORDER,
  },
  lineOn: {
    backgroundColor: colors.navy,
  },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: TILE_BORDER,
  },
  nodeOn: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  nodeText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
    marginBottom: spacing.md,
    padding: CARD_PAD,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    ...shadows.md,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardOn: {
    borderColor: colors.navy,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: borderRadius.lg,
  },
  copy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  label: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  pillOn: {
    backgroundColor: colors.navy,
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  pillTextOn: {
    color: colors.white,
  },
  submit: {
    // The last card already adds spacing.md below it
    marginTop: spacing.md,
  },
  footnote: {
    ...typographyPresets.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

export default InspectionAreaList;
