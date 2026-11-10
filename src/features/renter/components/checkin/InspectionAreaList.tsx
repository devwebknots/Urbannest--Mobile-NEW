/**
 * InspectionAreaList: the move-in inspection checklist. Progress bar, then
 * the areas as a numbered timeline, then "Finalize Inspection".
 * Tapping an area card opens that area's page (no selected state on tap).
 * Once the area page is finalized the area is "completed": its number turns
 * secondary blue (#518EF9), the line below it turns blue and the card shows a blue
 * "Completed" badge. Completed areas can still be opened again.
 * Finalize is enabled once every area is completed.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { InspectionArea } from '../../types';
import { TILE_BORDER } from './CheckInChecklist';
import { ChecklistProgress } from './ChecklistProgress';
import { CompletedBadge, DONE_BLUE } from './CompletedBadge';

interface Props {
  areas: readonly InspectionArea[];
  completed: ReadonlySet<string>;
  done: number;
  total: number;
  canSubmit: boolean;
  onOpen: (area: InspectionArea) => void;
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
  done: boolean;
  /** Step above is completed: colours the line coming into this number */
  prevDone: boolean;
  last: boolean;
  onPress: () => void;
}> = ({ area, index, done, prevDone, last, onPress }) => (
  <View style={styles.step}>
    <View style={styles.rail}>
      {/* Line from the step above into this number */}
      <View style={[styles.railTop, index > 0 && styles.line, prevDone && styles.lineDone]} />
      <View style={[styles.node, done && styles.nodeDone]}>
        <Text style={[styles.nodeText, done && styles.nodeTextDone]}>{index + 1}</Text>
      </View>
      {/* Line down to the next step */}
      {last ? null : <View style={[styles.lineDown, styles.line, done && styles.lineDone]} />}
    </View>

    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={area.label}
      accessibilityHint={done ? 'Completed. Opens to inspect again.' : 'Opens this area.'}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={area.image} style={styles.photo} resizeMode="cover" />
      <View style={styles.copy}>
        <Text style={styles.label} numberOfLines={1}>
          {area.label}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          {area.hint}
        </Text>
        {done ? (
          <View style={styles.badge}>
            <CompletedBadge />
          </View>
        ) : null}
      </View>
      <ChevronRightIcon size={ms(14)} color={colors.textMuted} />
    </Pressable>
  </View>
);

export const InspectionAreaList: React.FC<Props> = ({
  areas,
  completed,
  done,
  total,
  canSubmit,
  onOpen,
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
            done={completed.has(area.id)}
            prevDone={i > 0 && completed.has(areas[i - 1].id)}
            last={i === areas.length - 1}
            onPress={() => onOpen(area)}
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
          ? `Open each area to inspect it. ${remaining} ${remaining === 1 ? 'area' : 'areas'} remaining.`
          : 'All areas completed. Finalize to complete your inspection.'}
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
  lineDone: {
    backgroundColor: DONE_BLUE,
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
  // Softer secondary blue (#518EF9 at 70%), white number
  nodeDone: {
    backgroundColor: DONE_BLUE,
    borderColor: 'transparent',
  },
  nodeText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  nodeTextDone: {
    color: colors.white,
  },
  // Same white card whether completed or not (no selected border)
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
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: borderRadius.lg,
  },
  copy: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  label: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  badge: {
    marginTop: spacing.sm,
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
    opacity: 0.85,
  },
});

export default InspectionAreaList;
