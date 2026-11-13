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
 *  - JourneyStepRow: icon tile, title + line, chevron. Done steps get the
 *    app's done tick (DONE_BLUE circle, white check); every other step,
 *    the current one included, looks the same.
 */

import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BG, TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
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

export const JourneyStepRow: React.FC<{ row: JourneyRow; onPress: () => void }> = ({
  row,
  onPress,
}) => {
  const done = row.state === 'done';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${row.title}, ${row.detail}`}
      style={({ pressed }) => [styles.step, pressed && styles.pressed]}
    >
      <View style={styles.stepTile}>
        {done ? (
          // The app's done tick (as on the Maintenance timeline / Check-In)
          <View style={styles.doneTick}>
            <RenterIcon name="check" size={ms(13)} color={colors.white} />
          </View>
        ) : (
          <ApplicationIcon name={row.icon} size={ms(19)} color={colors.navy} />
        )}
      </View>
      <View style={styles.stepText}>
        <Text style={styles.stepTitle} numberOfLines={1}>
          {row.title}
        </Text>
        <Text style={styles.stepDetail} numberOfLines={2}>
          {row.detail}
        </Text>
      </View>
      <ChevronRightIcon size={ms(14)} color={colors.navy} />
    </Pressable>
  );
};

/** How far the photo's curved edge bulges out in the middle (share of its width) */
const PHOTO_BULGE = 0.1;
const FACT_TILE = ms(24);
const STEP_TILE = ms(44);
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
  statusTitle: {
    ...typographyPresets.sectionTitle,
    marginTop: spacing.xxs,
    color: colors.navy,
  },
  statusMessage: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  // Journey
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingLeft: spacing.sm + 2,
    paddingRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  stepTile: {
    width: STEP_TILE,
    height: STEP_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  // The app's done tick: DONE_BLUE circle, white check (TicketTimeline size)
  doneTick: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
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
