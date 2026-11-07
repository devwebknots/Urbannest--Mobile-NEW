/**
 * CheckInChecklist: move-in checklist laid out on the page (no outer box,
 * like the guest home sections): progress (n of 4 + gradient bar), a 2 x 2
 * grid of light task tiles and the primary "Submit Check-In" button.
 * Tiles are white with a hairline border; confirmed tiles turn soft blue
 * with a navy tick. Submit is enabled once every item is confirmed, then
 * becomes a soft "submitted" bar and the tiles lock.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { borderRadius, colors, gradients, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { CheckInTask } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';

interface Props {
  tasks: readonly CheckInTask[];
  confirmed: ReadonlySet<string>;
  done: number;
  total: number;
  canSubmit: boolean;
  submitted: boolean;
  onToggle: (task: CheckInTask) => void;
  onSubmit: () => void;
}

const Tile: React.FC<{
  task: CheckInTask;
  checked: boolean;
  locked: boolean;
  onPress: () => void;
}> = ({ task, checked, locked, onPress }) => (
  <Pressable
    onPress={onPress}
    disabled={locked}
    accessibilityRole="checkbox"
    accessibilityState={{ checked, disabled: locked }}
    accessibilityLabel={task.label}
    style={({ pressed }) => [styles.tile, checked && styles.tileOn, pressed && styles.pressed]}
  >
    <View style={styles.tileTop}>
      <View style={[styles.iconBox, checked && styles.iconBoxOn]}>
        <RenterIcon name={task.icon} size={ms(20)} color={colors.navy} />
      </View>
      <View style={[styles.tick, checked && styles.tickOn]}>
        {checked ? <RenterIcon name="check" size={ms(10)} color={colors.white} /> : null}
      </View>
    </View>
    <Text style={styles.tileLabel} numberOfLines={1}>
      {task.label}
    </Text>
    <Text style={[styles.tileHint, checked && styles.hintOn]} numberOfLines={1}>
      {checked ? 'Confirmed' : task.hint}
    </Text>
  </Pressable>
);

export const CheckInChecklist: React.FC<Props> = ({
  tasks,
  confirmed,
  done,
  total,
  canSubmit,
  submitted,
  onToggle,
  onSubmit,
}) => {
  const rows: CheckInTask[][] = [];
  for (let i = 0; i < tasks.length; i += 2) {
    rows.push(tasks.slice(i, i + 2));
  }
  const remaining = total - done;

  return (
    <View style={styles.card}>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>
          <Text style={styles.progressCount}>{done}</Text> of {total} confirmed
        </Text>
        <Text style={styles.progressPct}>{Math.round((done / total) * 100)}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${(done / total) * 100}%` }]}
        />
      </View>

      <View style={styles.grid}>
        {rows.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map(task => (
              <Tile
                key={task.id}
                task={task}
                checked={confirmed.has(task.id)}
                locked={submitted}
                onPress={() => onToggle(task)}
              />
            ))}
          </View>
        ))}
      </View>

      {submitted ? (
        <View style={[styles.submit, styles.submitDone]} accessibilityLabel="Check-in submitted">
          <View style={styles.doneDot}>
            <RenterIcon name="check" size={ms(11)} color={colors.white} />
          </View>
          <Text style={styles.submitDoneText}>Check-In Submitted</Text>
        </View>
      ) : (
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit }}
          accessibilityLabel="Submit check-in"
          style={({ pressed }) => [!canSubmit && styles.disabled, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={gradients.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submit}
          >
            <Text style={styles.submitText}>Submit Check-In</Text>
            <ArrowRightIcon size={ms(16)} color={colors.white} />
          </LinearGradient>
        </Pressable>
      )}
      <Text style={styles.footnote}>
        {submitted
          ? 'Your property manager will confirm your move-in shortly.'
          : remaining > 0
            ? `Tap to confirm ${remaining} more ${remaining === 1 ? 'item' : 'items'}.`
            : 'All set. Submit to complete your check-in.'}
      </Text>
    </View>
  );
};

/** Light blue tile edge, visible on the pale page */
const TILE_BORDER = '#C9DAF6';
/** Plain light tile fill (lighter than the page tint) */
const TILE_BG = '#F7FAFF';

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
  progressCount: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  progressPct: {
    ...typographyPresets.sectionLink,
    color: colors.navy,
  },
  track: {
    height: ms(4),
    marginTop: spacing.sm,
    borderRadius: ms(2),
    backgroundColor: colors.chipBlue,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: ms(2),
  },
  grid: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tile: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    // Plain light fill with a clear blue edge so it stands out on the page
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    ...shadows.md,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  tileOn: {
    backgroundColor: colors.chipBlue,
    borderColor: colors.navy,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBlue,
  },
  iconBoxOn: {
    backgroundColor: colors.white,
  },
  tick: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.textMuted,
  },
  tickOn: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  tileLabel: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
    marginTop: spacing.md,
  },
  tileHint: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  hintOn: {
    color: colors.navy,
  },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(48),
    marginTop: spacing.xl,
    borderRadius: borderRadius.button,
  },
  submitText: {
    ...typographyPresets.button,
    color: colors.white,
  },
  submitDone: {
    backgroundColor: colors.chipBlue,
  },
  doneDot: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navy,
  },
  submitDoneText: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  footnote: {
    ...typographyPresets.caption,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});

export default CheckInChecklist;
