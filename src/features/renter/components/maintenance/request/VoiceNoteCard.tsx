/**
 * VoiceNoteCard: "Describe by Voice" row on the request form. Pale blue
 * card: navy gradient round button with a soft glow, a thin divider,
 * title + hint, and a small blue sound wave on the right. The card follows
 * the recording:
 *  - idle:      mic button, "Tap to record a quick message"
 *  - recording: stop button, red dot + live timer ("0:12 / 2:00"), the
 *               wave moves; tap anywhere to stop
 *  - recorded:  play / pause button, "Voice note", time; the wave fills
 *               blue as it plays; small round delete button
 *  - starting / stopping: spinner in the button
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CloseIcon } from '@/components/icons';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '../../CircleIconButton';
import { RenterIcon } from '../../dashboard/RenterIcon';
import { formatClock, type VoiceNote, type VoiceNoteStatus } from '../../../hooks/useVoiceNote';

interface Props {
  status: VoiceNoteStatus;
  elapsedMs: number;
  maxMs: number;
  note: VoiceNote | null;
  playing: boolean;
  positionMs: number;
  onPress: () => void;
  onDelete: () => void;
}

/** Bar heights of the sound wave */
const WAVE = [8, 14, 22, 12, 28, 18, 30, 16, 24, 12, 8];

/** White play triangle / pause bars / stop square drawn with views */
const ButtonGlyph: React.FC<{ kind: 'play' | 'pause' | 'stop' }> = ({ kind }) => {
  if (kind === 'play') {
    return <View style={styles.play} />;
  }
  if (kind === 'pause') {
    return (
      <View style={styles.pause}>
        <View style={styles.pauseBar} />
        <View style={styles.pauseBar} />
      </View>
    );
  }
  return <View style={styles.stop} />;
};

export const VoiceNoteCard: React.FC<Props> = ({
  status,
  elapsedMs,
  maxMs,
  note,
  playing,
  positionMs,
  onPress,
  onDelete,
}) => {
  const recording = status === 'recording';
  const busy = status === 'starting' || status === 'stopping';
  const recorded = status === 'recorded' && note !== null;

  // Recording: bars shift every tick so the wave looks alive.
  // Playback: bars fill blue up to the played share.
  const tick = Math.floor(elapsedMs / 250);
  const played = recorded && note.durationMs > 0 ? positionMs / note.durationMs : 0;

  let title = 'Describe by Voice';
  let hint = 'Tap to record a quick message';
  let label = 'Describe by voice. Tap to record a quick message';
  if (busy) {
    hint = status === 'starting' ? 'Starting the microphone...' : 'Saving...';
    label = hint;
  } else if (recording) {
    title = 'Recording';
    hint = `${formatClock(elapsedMs)} / ${formatClock(maxMs)}  •  Tap to stop`;
    label = `Recording, ${formatClock(elapsedMs)}. Tap to stop`;
  } else if (recorded) {
    title = 'Voice note';
    hint = playing || positionMs > 0
      ? `${formatClock(positionMs)} / ${formatClock(note.durationMs)}`
      : formatClock(note.durationMs);
    label = `Voice note, ${formatClock(note.durationMs)}. ${playing ? 'Tap to pause' : 'Tap to play'}`;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.button, recording && styles.buttonRecording]}>
        {busy ? (
          <ActivityIndicator color={colors.white} />
        ) : recording ? (
          <ButtonGlyph kind="stop" />
        ) : recorded ? (
          <ButtonGlyph kind={playing ? 'pause' : 'play'} />
        ) : (
          <RenterIcon name="mic" size={ms(24)} color={colors.white} />
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          {recording ? <View style={styles.liveDot} /> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      </View>

      <View style={styles.wave} pointerEvents="none">
        {WAVE.map((h, i) => {
          const height = recording ? WAVE[(i + tick) % WAVE.length] : h;
          let color: string = i % 2 ? colors.headerGradientEnd : colors.primary;
          if (recorded) {
            color = (i + 0.5) / WAVE.length <= played ? colors.primary : colors.textSubtle;
          }
          return (
            <View key={i} style={[styles.bar, { height: ms(height), backgroundColor: color }]} />
          );
        })}
      </View>

      {recorded ? (
        <CircleIconButton
          size={ms(30)}
          onPress={onDelete}
          accessibilityLabel="Delete voice note"
          icon={<CloseIcon size={ms(10)} color={colors.navy} />}
        />
      ) : null}
    </Pressable>
  );
};

const BUTTON = ms(54);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundImage: `linear-gradient(120deg, ${colors.chipBlue} 0%, #EEF4FE 100%)`,
  },
  pressed: {
    opacity: 0.8,
  },
  button: {
    width: BUTTON,
    height: BUTTON,
    borderRadius: BUTTON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(145deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
    boxShadow: '0px 6px 14px rgba(6,89,178,0.35)',
  },
  // Stronger glow while the microphone is live
  buttonRecording: {
    boxShadow: '0px 0px 0px 6px rgba(81,142,249,0.25)',
  },
  play: {
    width: 0,
    height: 0,
    marginLeft: ms(4),
    borderTopWidth: ms(9),
    borderBottomWidth: ms(9),
    borderLeftWidth: ms(14),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
  },
  pause: {
    flexDirection: 'row',
    gap: ms(5),
  },
  pauseBar: {
    width: ms(5),
    height: ms(18),
    borderRadius: ms(1.5),
    backgroundColor: colors.white,
  },
  stop: {
    width: ms(16),
    height: ms(16),
    borderRadius: ms(3),
    backgroundColor: colors.white,
  },
  divider: {
    width: 1,
    height: ms(34),
    backgroundColor: 'rgba(11,42,91,0.15)',
  },
  copy: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  // Standard "recording" red dot
  liveDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.error,
  },
  title: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(2),
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(3),
  },
  bar: {
    width: ms(3),
    borderRadius: ms(1.5),
  },
});

export default VoiceNoteCard;
