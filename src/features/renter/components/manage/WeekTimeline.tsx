/**
 * WeekTimeline: "This Week" schedule in one white card. Each row has a
 * dot on a thin rail (the next item is solid navy, later ones are pale),
 * a calendar date badge, title + hint, and on the right either a status
 * pill ("Upcoming") or the amount, then a chevron. Rows are split by
 * hairlines.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { QuickAlert } from '../../types';
import { TILE_BG, TILE_BORDER } from '../checkin/CheckInChecklist';
import { ACCENTS } from '../dashboard/ConciergeGrid';

interface Props {
  alerts: readonly QuickAlert[];
  onPress: (alert: QuickAlert) => void;
}

export const WeekTimeline: React.FC<Props> = ({ alerts, onPress }) => (
  <View style={styles.card}>
    {alerts.map((alert, i) => {
      const accent = ACCENTS[alert.accent] ?? ACCENTS.navy;
      const first = i === 0;
      const last = i === alerts.length - 1;
      return (
        <Pressable
          key={alert.id}
          onPress={() => onPress(alert)}
          accessibilityRole="button"
          accessibilityLabel={`${alert.title}, ${alert.month} ${alert.day}${alert.amount ? `, ${alert.amount}` : ''}`}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
        >
          {/* Rail: line above and below the dot, joined across rows */}
          <View style={styles.rail}>
            <View style={[styles.line, first && styles.lineHidden]} />
            <View style={[styles.dot, first ? styles.dotNext : styles.dotLater]} />
            <View style={[styles.line, last && styles.lineHidden]} />
          </View>

          <View style={[styles.body, !last && styles.bodyDivider]}>
            <View style={styles.badge}>
              <Text style={[styles.badgeMonth, { color: accent.fg }]}>{alert.month}</Text>
              <Text style={styles.badgeDay}>{alert.day}</Text>
            </View>
            <View style={styles.text}>
              <Text style={styles.title} numberOfLines={1}>
                {alert.title}
              </Text>
              <Text style={styles.hint} numberOfLines={1}>
                {alert.hint}
              </Text>
            </View>
            {alert.tag ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{alert.tag}</Text>
              </View>
            ) : null}
            {alert.amount ? <Text style={styles.amount}>{alert.amount}</Text> : null}
            <ChevronRightIcon size={ms(12)} color={colors.textMuted} />
          </View>
        </Pressable>
      );
    })}
  </View>
);

const RADIUS = borderRadius.xxl + 2;
const BADGE_W = ms(44);
const BADGE_H = ms(46);
const DOT = ms(10);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    paddingLeft: spacing.md,
    paddingRight: spacing.lg,
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.7,
  },
  rail: {
    width: ms(20),
    alignItems: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: TILE_BORDER,
  },
  lineHidden: {
    backgroundColor: 'transparent',
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    marginVertical: ms(3),
  },
  dotNext: {
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: colors.tileBlue,
  },
  dotLater: {
    backgroundColor: colors.tileBlue,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginLeft: spacing.sm,
    paddingVertical: spacing.md,
  },
  bodyDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  badge: {
    width: BADGE_W,
    height: BADGE_H,
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
  },
  badgeMonth: {
    ...typographyPresets.badge,
    letterSpacing: 0.8,
  },
  badgeDay: {
    ...typographyPresets.sectionTitle,
    color: colors.navy,
  },
  text: {
    flex: 1,
  },
  title: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  tag: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.infoLight,
  },
  tagText: {
    ...typographyPresets.badge,
    color: colors.primaryDark,
  },
  amount: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
});

export default WeekTimeline;
