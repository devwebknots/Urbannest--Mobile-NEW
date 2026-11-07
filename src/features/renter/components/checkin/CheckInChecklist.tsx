/**
 * CheckInChecklist: one white card holding the whole move-in checklist —
 * progress (n of 4 + gradient bar), a 2 x 2 grid of tappable task tiles
 * and the primary "Submit Check-In" button. Tiles are pale (pageTint) with
 * a navy icon; confirmed tiles turn into navy gradient tiles with white
 * text. Submit is enabled once every item is confirmed, then becomes a
 * soft "submitted" bar and the tiles lock.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
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
    style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
  >
    {checked ? (
      <LinearGradient
        colors={gradients.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    ) : null}
    <View style={styles.tileTop}>
      <View style={[styles.iconBox, checked && styles.iconBoxOn]}>
        <RenterIcon name={task.icon} size={ms(19)} color={checked ? colors.white : colors.navy} />
      </View>
      <View style={[styles.tick, checked && styles.tickOn]}>
        {checked ? <RenterIcon name="check" size={ms(11)} color={colors.navy} /> : null}
      </View>
    </View>
    <Text style={[styles.tileLabel, checked && styles.textOn]} numberOfLines={1}>
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

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.xl,
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typographyPresets.bodyMedium,
    color: colors.textSecondary,
  },
  progressCount: {
    ...typographyPresets.price,
    color: colors.navy,
  },
  progressPct: {
    ...typographyPresets.sectionLink,
    color: colors.navy,
  },
  track: {
    height: ms(5),
    marginTop: spacing.md,
    borderRadius: ms(3),
    backgroundColor: colors.chipBlue,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: ms(3),
  },
  grid: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  tile: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.pageTint,
    overflow: 'hidden',
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  iconBoxOn: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  tick: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.textSubtle,
  },
  tickOn: {
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  tileLabel: {
    ...typographyPresets.listingTitle,
    marginTop: spacing.lg,
  },
  tileHint: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  textOn: {
    color: colors.white,
  },
  hintOn: {
    color: colors.textInverseMuted,
  },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(52),
    marginTop: spacing.xxl,
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
