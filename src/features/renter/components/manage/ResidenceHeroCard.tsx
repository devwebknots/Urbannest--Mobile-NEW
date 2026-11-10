/**
 * ResidenceHeroCard: frosted-glass card for the active residence, laid
 * over the bottom of the header photo. Glass across the full card: the
 * residence photo blurred under a light brand-blue tint.
 *  - top: "● Active Lease" pill, Playfair name, map pin + unit · city;
 *    glowing lavender arrow circle on the right
 *  - bottom: the four labelled shortcuts (ManageActionRow) with dividers
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MapPinIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { ManageAction, Residence } from '../../types';
import { ManageActionRow } from './ManageActionRow';

interface Props {
  residence: Residence;
  actions: readonly ManageAction[];
  onOpen: () => void;
  onAction: (action: ManageAction) => void;
}

export const ResidenceHeroCard: React.FC<Props> = ({ residence, actions, onOpen, onAction }) => (
  <View style={styles.shadow}>
    <View style={styles.card}>
      {/* Blurred photo under the whole card = frosted glass edge to edge */}
      <Image source={residence.image} style={styles.photo} resizeMode="cover" blurRadius={14} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      <View style={[StyleSheet.absoluteFill, styles.sheen]} />

      <View style={styles.top}>
        <View style={styles.info}>
          <View style={styles.pill}>
            <View style={styles.liveDot} />
            <Text style={styles.pillText}>Active Lease</Text>
          </View>
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            {residence.name}
          </Text>
          <View style={styles.unitRow}>
            <MapPinIcon size={ms(12)} color={colors.white} />
            <Text style={styles.unit} numberOfLines={1}>
              {residence.unit} · {residence.city}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onOpen}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Open ${residence.name}`}
          style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}
        >
          <ArrowRightIcon size={ms(15)} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <ManageActionRow actions={actions} onPress={onAction} />
      </View>
    </View>
  </View>
);

const RADIUS = borderRadius.xxl + 2;
const ARROW = ms(40);

const styles = StyleSheet.create({
  shadow: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: RADIUS,
    boxShadow: '0px 14px 28px rgba(11, 29, 58, 0.28)',
  },
  card: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.headerDarkBlue,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  // Oversized past every edge: Android's blur leaves the bitmap short of
  // the frame (a visible cut line); the card's overflow clips the extra
  photo: {
    position: 'absolute',
    top: '-50%',
    bottom: '-50%',
    left: '-25%',
    right: '-25%',
  },
  // Light brand-blue glass (headerGradientEnd #518EF9) over the blurred
  // photo, with a faint navy base so the white text stays readable
  tint: {
    backgroundImage:
      'linear-gradient(to right, rgba(81,142,249,0.42) 0%, rgba(37,99,235,0.42) 100%), linear-gradient(rgba(11,29,58,0.18), rgba(11,29,58,0.18))',
  },
  // Faint light from the top edge, like glass
  sheen: {
    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 45%)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },
  info: {
    flex: 1,
    alignItems: 'flex-start',
  },
  // Light frosted pill
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  liveDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(3.5),
    backgroundColor: colors.liveBadge.dot,
  },
  pillText: {
    ...typographyPresets.badge,
    color: colors.white,
  },
  name: {
    ...typographyPresets.sectionTitle,
    marginTop: spacing.sm,
    color: colors.white,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
    marginTop: spacing.xs,
  },
  unit: {
    ...typographyPresets.caption,
    flexShrink: 1,
    color: colors.white,
  },
  // Light lavender circle, blue arrow, soft violet glow
  arrow: {
    width: ARROW,
    height: ARROW,
    borderRadius: ARROW / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.avatarPurple.bg,
    borderWidth: 1.5,
    borderColor: colors.white,
    boxShadow: '0px 0px 18px rgba(139, 92, 246, 0.85)',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  // Shortcut strip along the bottom
  actions: {
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
});

export default ResidenceHeroCard;
