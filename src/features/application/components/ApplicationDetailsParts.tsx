/**
 * Application Details page pieces (layout from the "Application Details"
 * design, app theme values):
 *  - ApplicationSummaryCard: one white card; swipeable photo on the left
 *    (category tag top-left, right edge one outward arc as in the design);
 *    name + StatusPill, address and fact rows (tileBlue icon tile, label,
 *    hairline, value) on the right.
 *  - CurrentStatusCard: "CURRENT STATUS" eyebrow, Playfair title and line,
 *    the design's document illustration on the left, soft blue swell in the
 *    bottom-right corner.
 *  - JourneyStepRow: timeline rail on the left (done = the app's DONE_BLUE
 *    tick, current = secondary-blue ring + dot, upcoming = grey dot; the
 *    line is DONE_BLUE up to the current step) and a card: icon tile,
 *    title + line; done cards show the date + "View" (not on Application
 *    Status), the current one is pale blue with a loader, or a blinking
 *    arrow when it's the renter's turn (accept, review, pay, sign).
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { ChevronRightIcon } from '@/components/icons';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { moderateScale as ms } from '@/utils/responsive';
import type { JourneyRow } from '../hooks/useApplicationDetails';
import type { ApplicationIconName, ApplicationRecord } from '../types';
import { STATUS_DOCUMENTS_ASPECT, applicationAssets } from '../assets/applicationAssets';
import { ApplicationIcon } from './ApplicationIcon';
import { StatusPill } from './ApplicationStatusParts';

// colors.headerGradientEnd (#518EF9) as rgb, for glows and fades
const BLUE = '81,142,249';

/* ---------- Summary card ---------- */

interface Fact {
  id: string;
  icon: ApplicationIconName;
  label: string;
  value: string;
}

export const ApplicationSummaryCard: React.FC<{
  record: ApplicationRecord;
  photos: readonly number[];
  facts: readonly Fact[];
  /** Card width (screen width minus the side padding) */
  width: number;
}> = ({ record, photos, facts, width }) => {
  const photoW = Math.round(width * 0.4);
  // Photo height follows the info column (measured)
  const [photoH, setPhotoH] = useState(0);

  // Curved right edge (as in the design): the photo is clipped by a big
  // circle whose arc bulges out by BULGE in the middle and meets the card's
  // top / bottom edges BULGE further in. The card clips the rest.
  const bulge = photoW * PHOTO_BULGE;
  const radius = photoH > 0 ? (photoH / 2) ** 2 / (2 * bulge) + bulge / 2 : 0;
  const d = radius * 2;

  return (
    <View style={[styles.card, { width }]}>
      <View
        style={[styles.photoBox, { width: photoW }]}
        onLayout={e => setPhotoH(e.nativeEvent.layout.height)}
      >
        {photoH > 0 ? (
          <View
            style={[
              styles.photoClip,
              {
                width: d,
                height: d,
                borderRadius: radius,
                left: photoW - d,
                top: photoH / 2 - radius,
              },
            ]}
          >
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={[
                styles.photoScroll,
                {
                left: d - photoW,
                top: radius - photoH / 2,
                width: photoW,
                height: photoH,
                },
              ]}
            >
              {photos.map((p, i) => (
                <Image
                  key={i}
                  source={p}
                  style={{ width: photoW, height: photoH }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        ) : null}
        {record.category ? (
          <View pointerEvents="none" style={styles.tag}>
            <ApplicationIcon name="house" size={ms(12)} color={colors.white} />
            <Text style={styles.tagText} numberOfLines={1}>
              {record.category}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.info}>
        {/* Name left, status pill top-right opposite it */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={2}>
            {record.propertyName}
          </Text>
          <StatusPill status={record.status} style={styles.namePill} />
        </View>
        {record.address ? (
          <Text style={styles.address} numberOfLines={1}>
            {record.address}
          </Text>
        ) : null}

        <View style={styles.facts}>
          {facts.map((f, i) => (
            <View key={f.id} style={[styles.fact, i > 0 && styles.factLine]}>
              <View style={styles.factTile}>
                <ApplicationIcon name={f.icon} size={ms(13)} color={colors.navy} />
              </View>
              <Text style={styles.factLabel} numberOfLines={1}>
                {f.label}
              </Text>
              <View style={styles.factDivider} />
              <Text
                style={styles.factValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                selectable
              >
                {f.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/* ---------- Current status ---------- */

export const CurrentStatusCard: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <View style={styles.status}>
    {/* The design's document illustration */}
    <Image source={applicationAssets.statusDocuments} style={styles.statusArt} resizeMode="contain" />
    <View style={styles.statusText}>
      <Text style={styles.eyebrow}>Current Status</Text>
      <Text style={styles.statusTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.statusMessage}>{message}</Text>
    </View>
  </View>
);

/* ---------- Journey ---------- */

/**
 * "Your turn" cue on the current step when the renter must act (Offer
 * Acceptance, Lease Review, Payment, Lease Signing): the rows' chevron,
 * blinking and nudging right. Still with Reduce Motion on.
 */
const ActionArrow: React.FC = () => {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(reduce => {
        if (cancelled || reduce) {
          return;
        }
        const step = (toValue: number) =>
          Animated.timing(blink, {
            toValue,
            duration: 650,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          });
        loop = Animated.loop(Animated.sequence([step(0), step(1)]));
        loop.start();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [blink]);

  return (
    <Animated.View
      accessibilityLabel="Your action needed"
      style={[
        styles.actionArrow,
        {
          opacity: blink.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }),
          transform: [
            { translateX: blink.interpolate({ inputRange: [0, 1], outputRange: [ms(3), 0] }) },
          ],
        },
      ]}
    >
      <ChevronRightIcon size={ms(14)} color={colors.navy} />
    </Animated.View>
  );
};

/** Rail marker: done tick / current ring + dot / upcoming grey dot */
const RailMarker: React.FC<{ state: JourneyRow['state'] }> = ({ state }) => {
  if (state === 'done') {
    // The app's done tick (as on the Maintenance timeline / Check-In)
    return (
      <View style={styles.markerDone}>
        <RenterIcon name="check" size={ms(11)} color={colors.white} />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={styles.markerCurrent}>
        <View style={styles.markerCurrentDot} />
      </View>
    );
  }
  return <View style={styles.markerUpcoming} />;
};

/**
 * One journey step: the rail (line above, marker, line below) and the card.
 * The line below a done step is DONE_BLUE, so the filled part of the rail
 * runs from the first step to the current one.
 */
export const JourneyStepRow: React.FC<{
  row: JourneyRow;
  first: boolean;
  last: boolean;
  /** The step above is done (colours the line into this marker) */
  prevDone: boolean;
  onPress: () => void;
}> = ({ row, first, last, prevDone, onPress }) => {
  const done = row.state === 'done';
  const current = row.state === 'current';
  return (
    <View style={styles.stepRow}>
      <View style={styles.rail}>
        <View style={[styles.railLine, first && styles.railHidden, prevDone && styles.railDone]} />
        <RailMarker state={row.state} />
        <View style={[styles.railLine, last && styles.railHidden, done && styles.railDone]} />
      </View>

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${row.title}, ${row.detail}`}
        style={({ pressed }) => [
          styles.step,
          current && styles.stepCurrent,
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.stepTile, current && styles.stepTileCurrent]}>
          <ApplicationIcon name={row.icon} size={ms(18)} color={colors.navy} />
        </View>
        <View style={styles.stepText}>
          <Text style={styles.stepTitle} numberOfLines={1}>
            {row.title}
          </Text>
          <Text style={styles.stepDetail} numberOfLines={2}>
            {row.detail}
          </Text>
        </View>
        {done ? (
          row.date || row.viewable ? (
            <View style={styles.stepAside}>
              {row.date ? <Text style={styles.stepDate}>{row.date}</Text> : null}
              {row.viewable ? (
                <View style={styles.viewPill}>
                  <Text style={styles.viewText}>View</Text>
                </View>
              ) : null}
            </View>
          ) : null
        ) : current ? (
          // Renter's turn: blinking arrow; otherwise we're working on it: loader
          row.userAction ? (
            <ActionArrow />
          ) : (
            <ActivityIndicator size="small" color={colors.headerGradientEnd} />
          )
        ) : null}
      </Pressable>
    </View>
  );
};

/** How far the photo's curved edge bulges out in the middle (share of its width) */
const PHOTO_BULGE = 0.1;
const FACT_TILE = ms(24);
const STEP_TILE = ms(40);
const RAIL = ms(22);
const MARKER = ms(22);
const ART = ms(72);

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  // Summary card
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.md,
  },
  photoBox: {
    // Height follows the info column
    alignSelf: 'stretch',
    minHeight: ms(160),
  },
  photoClip: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  photoScroll: {
    position: 'absolute',
  },
  tag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.lg,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: `${colors.navy}D9`,
  },
  tagText: {
    ...typographyPresets.badge,
    flexShrink: 1,
    color: colors.white,
  },
  info: {
    flex: 1,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm + 2,
    paddingRight: spacing.md,
    paddingLeft: spacing.md,
  },
  nameRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  name: {
    ...typographyPresets.listingTitle,
    flex: 1,
    color: colors.navy,
  },
  namePill: {
    marginTop: 0,
    maxWidth: '55%',
    flexShrink: 1,
  },
  address: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(2),
  },
  facts: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs + 1,
  },
  factLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  factTile: {
    width: FACT_TILE,
    height: FACT_TILE,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  factLabel: {
    ...typographyPresets.label,
    flexShrink: 1,
  },
  factDivider: {
    width: StyleSheet.hairlineWidth,
    height: ms(12),
    marginLeft: 'auto',
    backgroundColor: TILE_BORDER,
  },
  factValue: {
    ...typographyPresets.fieldLabel,
    flexShrink: 1,
    color: colors.navy,
    textAlign: 'right',
  },
  // Current status
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    overflow: 'hidden',
    // Soft blue swell in the bottom-right corner (the design's wave)
    backgroundImage: `radial-gradient(circle at 105% 120%, rgba(${BLUE},0.28) 0%, rgba(${BLUE},0.08) 45%, rgba(${BLUE},0) 70%)`,
  },
  statusArt: {
    width: ART * STATUS_DOCUMENTS_ASPECT,
    height: ART,
  },
  statusText: {
    flex: 1,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.textSecondary,
  },
  // Smallest Playfair heading in the app (formHeading, 15)
  statusTitle: {
    ...typographyPresets.formHeading,
    marginTop: spacing.xxs,
    color: colors.navy,
  },
  statusMessage: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  // Journey
  // Rail + card
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rail: {
    width: RAIL,
    alignItems: 'center',
  },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
  },
  railHidden: {
    backgroundColor: 'transparent',
  },
  railDone: {
    backgroundColor: DONE_BLUE,
  },
  // The app's done tick: DONE_BLUE circle, white check
  markerDone: {
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
  // Current: secondary-blue ring with a dot
  markerCurrent: {
    width: MARKER,
    height: MARKER,
    borderRadius: MARKER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.headerGradientEnd,
    backgroundColor: colors.white,
  },
  markerCurrentDot: {
    width: ms(9),
    height: ms(9),
    borderRadius: ms(4.5),
    backgroundColor: colors.headerGradientEnd,
  },
  markerUpcoming: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: colors.textSubtle,
  },
  step: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xs,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingLeft: spacing.sm + 2,
    paddingRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  // Next step after the completed ones: pale blue card
  stepCurrent: {
    backgroundColor: colors.chipBlue,
    borderColor: colors.chipBlue,
  },
  stepTile: {
    width: STEP_TILE,
    height: STEP_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  stepTileCurrent: {
    backgroundColor: colors.white,
  },
  stepAside: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  stepDate: {
    ...typographyPresets.label,
    color: colors.textSecondary,
  },
  // Bare arrow tucked into the card's right padding: takes almost no width,
  // so the step text doesn't wrap and the card keeps its height
  actionArrow: {
    marginLeft: -spacing.sm,
    marginRight: -spacing.xs,
  },
  viewPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  viewText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  stepDetail: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(1),
  },
});
