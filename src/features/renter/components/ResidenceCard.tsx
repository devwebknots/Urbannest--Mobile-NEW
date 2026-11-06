/**
 * ResidenceCard: rounded photo with a status pill and a "more" button,
 * then name (+ premium badge), address, and a footer with lease facts
 * and the main action.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from '@/components/LinearGradient';
import { CalendarIcon, ClockIcon, MapPinIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  commonStyles,
  gradients,
  shadows,
  spacing,
  typographyPresets,
} from '@/config/theme';
import {
  ArrowCircleIcon,
  StarGlyph,
} from '@/features/guest/components/GuestIcons';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { ACTION_LABEL, RESIDENCE_IMAGE_RATIO, STATUS_LABEL } from '../constants';
import type { LeaseStatus, Residence, ResidenceMeta } from '../types';

interface Props {
  residence: Residence;
  width: number;
  onPress: () => void;
  onMenuPress: () => void;
}

const STATUS_DOT: Record<LeaseStatus, string> = {
  moveInReady: '#4ADE80',
  active: '#4ADE80',
  expired: colors.textSubtle,
};

const MoreDots: React.FC = () => (
  <View style={styles.dots}>
    {[0, 1, 2].map(i => (
      <View key={i} style={styles.dotSmall} />
    ))}
  </View>
);

const Meta: React.FC<{ meta: ResidenceMeta }> = ({ meta }) => {
  const Icon = meta.icon === 'clock' ? ClockIcon : CalendarIcon;
  return (
    <View style={styles.meta}>
      <View style={styles.metaIcon}>
        <Icon size={ms(15)} color={colors.navy} />
      </View>
      <View>
        <Text style={styles.metaLabel} numberOfLines={1}>
          {meta.label}
        </Text>
        <Text style={styles.metaValue} numberOfLines={1}>
          {meta.value}
        </Text>
      </View>
    </View>
  );
};

const ActionButton: React.FC<{ status: LeaseStatus; onPress: () => void }> = ({
  status,
  onPress,
}) => {
  const label = ACTION_LABEL[status];
  if (status === 'moveInReady') {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.action, styles.actionSolid]}
        >
          <Text style={[styles.actionText, styles.actionTextLight]}>{label}</Text>
          <ArrowCircleIcon size={ms(30)} background={colors.white} color={colors.navy} />
        </LinearGradient>
      </Pressable>
    );
  }
  if (status === 'expired') {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.link}
      >
        <Text style={styles.actionText}>{label}</Text>
        <ArrowCircleIcon size={ms(22)} background={colors.navy} color={colors.white} />
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.action, styles.actionSoft]}
    >
      <Text style={styles.actionText}>{label}</Text>
      <ArrowCircleIcon size={ms(30)} background={colors.navy} color={colors.white} />
    </Pressable>
  );
};

export const ResidenceCard: React.FC<Props> = ({
  residence,
  width,
  onPress,
  onMenuPress,
}) => {
  const past = residence.status === 'expired';
  const imageHeight = Math.round(width * RESIDENCE_IMAGE_RATIO);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={residence.name}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <View style={[styles.media, { height: imageHeight }]}>
        <Image
          source={residence.image}
          style={[{ width, height: imageHeight }, past && styles.imagePast]}
          resizeMode="cover"
        />
        <Scrim edge="top" extent={0.5} maxOpacity={0.3} />

        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: STATUS_DOT[residence.status] }]} />
          <Text style={styles.statusText}>{STATUS_LABEL[residence.status]}</Text>
        </View>

        <Pressable
          onPress={onMenuPress}
          hitSlop={8}
          style={styles.menu}
          accessibilityRole="button"
          accessibilityLabel={`More options for ${residence.name}`}
        >
          <MoreDots />
        </Pressable>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[typographyPresets.listingTitle, styles.name]} numberOfLines={2}>
            {residence.name}
          </Text>
          {residence.premium ? (
            <View style={commonStyles.premiumBadge}>
              <StarGlyph size={scaleFont(9)} color={colors.gold} />
              <Text style={typographyPresets.premiumBadge}>Premium</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.addressRow}>
          <MapPinIcon size={ms(14)} color={colors.navy} style={styles.pin} />
          <Text style={styles.address} numberOfLines={2}>
            {residence.street}
            {'\n'}
            {residence.city}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            {residence.meta.map((m, i) => (
              <React.Fragment key={m.label}>
                {i > 0 ? <View style={styles.metaDivider} /> : null}
                <Meta meta={m} />
              </React.Fragment>
            ))}
          </View>
          <View style={styles.actionSlot}>
            <ActionButton status={residence.status} onPress={onPress} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const RADIUS = borderRadius.xxl + 2;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    shadowColor: colors.headerDarkBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  media: {
    overflow: 'hidden',
    borderRadius: RADIUS,
    backgroundColor: colors.surfaceMuted,
  },
  imagePast: {
    opacity: 0.9,
  },
  statusBadge: {
    position: 'absolute',
    top: spacing.md + 2,
    left: spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(7),
    paddingHorizontal: spacing.md,
    height: ms(28),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(11,29,58,0.72)',
  },
  statusDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  statusText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  menu: {
    position: 'absolute',
    top: spacing.md + 2,
    right: spacing.md + 2,
    width: ms(34),
    height: ms(34),
    borderRadius: borderRadius.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  dots: {
    flexDirection: 'row',
    gap: ms(3),
  },
  dotSmall: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: colors.white,
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md + 2,
    paddingBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    marginTop: spacing.sm,
  },
  pin: {
    marginTop: 2,
  },
  address: {
    ...typographyPresets.cardSubtitle,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: spacing.md,
    marginTop: spacing.md + 2,
    paddingTop: spacing.md + 2,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pageTint,
  },
  metaLabel: {
    ...typographyPresets.cardSubtitle,
  },
  metaValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  // Pushed right; drops to its own line when the facts need the room
  actionSlot: {
    marginLeft: 'auto',
  },
  metaDivider: {
    width: 1,
    height: ms(30),
    marginHorizontal: spacing.md - 2,
    backgroundColor: colors.border,
  },
  // Same width for "Check-In Now" and "Manage"; text left, arrow circle right
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: ms(150),
    gap: spacing.sm,
    height: ms(42),
    paddingLeft: spacing.lg,
    paddingRight: ms(6),
    borderRadius: borderRadius.pill,
  },
  actionSolid: {
    ...shadows.md,
  },
  actionSoft: {
    backgroundColor: colors.chipBlue,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
  },
  actionText: {
    ...typographyPresets.button,
    color: colors.navy,
  },
  actionTextLight: {
    color: colors.white,
  },
});

export default ResidenceCard;
