/**
 * TicketTimeline: "Activity Timeline" steps on the Ticket Details page,
 * laid on the page (no card). Each step: a marker on a vertical line, then
 * title + time and a short line. Markers:
 *  - done:    secondary-blue circle with a white tick (app done colour)
 *  - current: navy gradient circle with the tools icon and a soft halo
 *  - pending: pale grey circle with a grey dot
 * The line below a done step is secondary blue, the rest light grey.
 * A step can carry a work photo (tap for full screen).
 * Completed tickets (Completed design): every tick and the line are green,
 * and the final "Completed" step sits on a pale green wash with a green
 * title.
 */

import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, gradients, spacing, typographyPresets, borderRadius } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { DONE_BLUE } from '../../checkin/CompletedBadge';
import { RenterIcon } from '../../dashboard/RenterIcon';
import type { TicketStepState, TicketTimelineStep } from '../../../types';

interface Props {
  steps: readonly TicketTimelineStep[];
  /** Screen width, for the photo size */
  width: number;
  onPhotoPress: (image: ImageSourcePropType) => void;
  /** Finished ticket: green ticks and line, last step on a green wash */
  completed?: boolean;
}

const MARKER = ms(36);

const Marker: React.FC<{ state: TicketStepState; completed: boolean }> = ({
  state,
  completed,
}) => {
  if (state === 'done') {
    return (
      <View style={[styles.marker, styles.done, completed && styles.doneGreen]}>
        <RenterIcon name="check" size={ms(13)} color={colors.white} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.marker, styles.current]}>
        <RenterIcon name="tools" size={ms(18)} color={colors.white} />
      </View>
    );
  }
  return (
    <View style={[styles.marker, styles.pending]}>
      <View style={styles.pendingDot} />
    </View>
  );
};

/** Four white corners: "tap to expand" hint on the photo */
const ExpandHint: React.FC = () => (
  <View style={styles.expand}>
    <View style={[styles.corner, styles.cornerTL]} />
    <View style={[styles.corner, styles.cornerTR]} />
    <View style={[styles.corner, styles.cornerBL]} />
    <View style={[styles.corner, styles.cornerBR]} />
  </View>
);

export const TicketTimeline: React.FC<Props> = ({
  steps,
  width,
  onPhotoPress,
  completed = false,
}) => {
  const photoWidth = Math.round(width - spacing.screenHorizontal * 2 - MARKER - spacing.lg);
  // Wide strip like the design (photo is 1000 x 303, cover trims the sides a little)
  const photoHeight = Math.round(photoWidth * 0.36);
  return (
    <View style={styles.list}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const pending = step.state === 'pending';
        // Completed ticket: the final "Completed" step sits on a green wash
        const highlight = completed && last;
        return (
          <View key={step.id} style={[styles.step, highlight && styles.stepHighlight]}>
            <View style={styles.rail}>
              {/* Carries the line down to the marker inside the wash */}
              {highlight ? <View style={[styles.stub, styles.lineGreen]} /> : null}
              <Marker state={step.state} completed={completed} />
              {last ? null : (
                <View
                  style={[
                    styles.line,
                    step.state === 'done' && (completed ? styles.lineGreen : styles.lineDone),
                  ]}
                />
              )}
            </View>

            <View style={[styles.body, !last && styles.bodySpaced]}>
              <View style={styles.head}>
                <Text
                  style={[
                    styles.title,
                    pending && styles.titlePending,
                    highlight && styles.titleGreen,
                  ]}
                >
                  {step.title}
                </Text>
                <Text style={styles.time} numberOfLines={1}>
                  {step.time}
                </Text>
              </View>
              <Text style={styles.detail}>{step.detail}</Text>

              {step.photo ? (
                <Pressable
                  onPress={() => step.photo && onPhotoPress(step.photo.image)}
                  accessibilityRole="imagebutton"
                  accessibilityLabel={`${step.photo.caption}, open photo`}
                  style={({ pressed }) => [
                    styles.photo,
                    { width: photoWidth, height: photoHeight },
                    pressed && styles.pressed,
                  ]}
                >
                  <Image
                    source={step.photo.image}
                    style={{ width: photoWidth, height: photoHeight }}
                    resizeMode="cover"
                  />
                  <View style={[StyleSheet.absoluteFill, styles.scrim]} />
                  <View style={styles.photoFooter}>
                    <Text style={styles.caption} numberOfLines={1}>
                      {step.photo.caption}
                    </Text>
                    <ExpandHint />
                  </View>
                </Pressable>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const EXPAND = ms(16);
const CORNER = ms(6);

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  rail: {
    width: MARKER,
    alignItems: 'center',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  done: {
    width: ms(30),
    height: ms(30),
    marginVertical: ms(3),
    borderRadius: ms(15),
    backgroundColor: DONE_BLUE,
  },
  doneGreen: {
    backgroundColor: colors.success,
  },
  current: {
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    backgroundImage: `linear-gradient(135deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
    // Soft secondary-blue halo around the step in progress
    boxShadow: '0px 0px 0px 5px rgba(81,142,249,0.18)',
  },
  pending: {
    width: ms(26),
    height: ms(26),
    marginVertical: ms(5),
    borderRadius: ms(13),
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pendingDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: colors.textMuted,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: spacing.xs,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  lineDone: {
    backgroundColor: DONE_BLUE,
  },
  lineGreen: {
    backgroundColor: colors.success,
  },
  // Final step of a completed ticket: pale green wash (success at 10%)
  stepHighlight: {
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(16,185,129,0.10)',
  },
  stub: {
    position: 'absolute',
    top: -spacing.sm,
    width: 2,
    height: spacing.sm + ms(3),
  },
  body: {
    flex: 1,
    paddingTop: ms(7),
  },
  bodySpaced: {
    paddingBottom: spacing.xl,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    ...typographyPresets.cardTitle,
    flex: 1,
    color: colors.navy,
  },
  titlePending: {
    color: colors.textSecondary,
  },
  titleGreen: {
    color: colors.successDark,
  },
  time: {
    ...typographyPresets.caption,
    marginTop: ms(3),
    color: colors.textSecondary,
  },
  detail: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  photo: {
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  scrim: {
    backgroundImage: 'linear-gradient(to top, rgba(11,29,58,0.7) 0%, rgba(11,29,58,0) 55%)',
  },
  photoFooter: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  caption: {
    ...typographyPresets.bodyMedium,
    flex: 1,
    color: colors.white,
  },
  expand: {
    width: EXPAND,
    height: EXPAND,
  },
  corner: {
    position: 'absolute',
    width: CORNER,
    height: CORNER,
    borderColor: colors.white,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 2 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 2 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 2 },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 2,
  },
});

export default TicketTimeline;
