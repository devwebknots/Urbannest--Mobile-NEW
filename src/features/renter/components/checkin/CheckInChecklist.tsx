/**
 * CheckInChecklist: move-in checklist laid out on the page (no outer box,
 * like the guest home sections): progress (n of 4 + gradient bar), a 2 x 2
 * grid of light task tiles and the primary "Submit Check-In" button.
 * Tiles are light with a hairline border. Done tiles keep the same look
 * (no border / fill change, as on the inspection page); they get a soft
 * secondary-blue tick in the corner (the hint stays). Submit is enabled once every item is done, then becomes a soft
 * "submitted" bar and the tiles lock.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { CheckInTask } from '../../types';
import { RenterIcon } from '../dashboard/RenterIcon';
import { ChecklistProgress } from './ChecklistProgress';
import { DONE_BLUE } from './CompletedBadge';

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
    // Items with their own screen open it instead of ticking on tap
    accessibilityRole={task.screen ? 'button' : 'checkbox'}
    accessibilityState={{ checked, disabled: locked }}
    accessibilityLabel={task.label}
    style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
  >
    <View style={styles.tileTop}>
      <View style={styles.iconBox}>
        <RenterIcon name={task.icon} size={ms(20)} color={colors.navy} />
      </View>
      {/* Tick only appears once the item is completed (no empty dot before) */}
      {checked ? (
        <View style={styles.tick}>
          <RenterIcon name="check" size={ms(10)} color={colors.white} />
        </View>
      ) : null}
    </View>
    <Text style={styles.tileLabel} numberOfLines={1}>
      {task.label}
    </Text>
    <Text style={styles.tileHint} numberOfLines={1}>
      {task.hint}
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
      <ChecklistProgress done={done} total={total} />

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
        <Button
          title="Submit Check-In"
          variant="brand"
          onPress={onSubmit}
          disabled={!canSubmit}
          rightIcon={<ArrowRightIcon size={ms(16)} color={colors.white} />}
          style={styles.submitButton}
        />
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

/** Light blue tile edge, visible on the pale page (also used by the inspection list) */
export const TILE_BORDER = '#C9DAF6';
/** Plain light tile fill (lighter than the page tint) */
export const TILE_BG = '#F7FAFF';

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: spacing.screenHorizontal,
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
  // Soft secondary-blue tick (same as the inspection done marks)
  tick: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
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
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: ms(48),
    marginTop: spacing.xl,
    borderRadius: borderRadius.button,
  },
  submitButton: {
    marginTop: spacing.xl,
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
    backgroundColor: DONE_BLUE,
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
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});

export default CheckInChecklist;
