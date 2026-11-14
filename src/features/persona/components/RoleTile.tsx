/**
 * RoleTile: one role in the Add Persona grid. Frosted dark tile with a soft
 * top-down sheen and a light top rim; a small round photo that shows the
 * role (light ring, drop shadow) centred over the role name. Roles already
 * on the account get a small green dot on the photo. The chosen tile gets
 * only the app's done tick (secondary blue), a gentle lift and a blue halo
 * behind its photo; the others sit back a little. No selected stroke or
 * fill.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { RenterIcon } from '@/features/renter/components/dashboard/RenterIcon';
import { DONE_BLUE } from '@/features/renter/components/checkin/CompletedBadge';
import { moderateScale as ms } from '@/utils/responsive';
import type { PersonaRole } from '../types';

const DISC = ms(52);
const HALO = ms(68);

interface Props {
  role: PersonaRole;
  width: number;
  selected: boolean;
  added: boolean;
  onPress: () => void;
}

export const RoleTile: React.FC<Props> = ({ role, width, selected, added, onPress }) => {
  const focus = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(focus, {
      toValue: selected ? 1 : 0,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [selected, focus]);

  const motion = {
    opacity: focus.interpolate({ inputRange: [0, 1], outputRange: [0.74, 1] }),
    transform: [
      { scale: focus.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
      { translateY: focus.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
    ],
  };
  const halo = {
    opacity: focus,
    transform: [
      { scale: focus.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
    ],
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${role.title}${added ? ', added' : ''}`}
      accessibilityState={{ selected }}
      style={{ width }}
    >
      <Animated.View style={[styles.tile, motion]}>
        <View style={styles.rim} />

        <View style={styles.iconWrap}>
          <Animated.View style={[styles.halo, halo]} />
          <View style={styles.disc}>
            <Image source={role.image} resizeMode="cover" style={styles.photo} />
          </View>
          {added && <View style={styles.addedDot} />}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {role.title}
        </Text>

        {selected && (
          <View style={styles.tick}>
            <RenterIcon name="check" size={ms(9)} color={colors.white} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // No fixed height: equal space above the photo and below the name, and
  // the name always keeps two lines, so every tile is the same height
  tile: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    // Soft sheen: lighter at the top, fading into the backdrop
    backgroundImage:
      'linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(81,142,249,0.06) 55%, rgba(11,29,58,0.10) 100%)',
  },
  // Thin light rim along the top edge (glass highlight)
  rim: {
    position: 'absolute',
    top: 0,
    left: '18%',
    right: '18%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  // Only the photo takes layout space; the halo spreads around it
  iconWrap: {
    width: DISC,
    height: DISC,
  },
  halo: {
    position: 'absolute',
    top: -(HALO - DISC) / 2,
    left: -(HALO - DISC) / 2,
    width: HALO,
    height: HALO,
    borderRadius: HALO / 2,
    backgroundColor: 'rgba(81,142,249,0.16)',
    boxShadow: '0px 0px 22px rgba(81,142,249,0.45)',
  },
  // Round photo with a thin light ring around it
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    boxShadow: '0px 6px 14px rgba(0,0,0,0.35)',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: DISC / 2,
  },
  addedDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: ms(11),
    height: ms(11),
    borderRadius: ms(5.5),
    borderWidth: 2,
    borderColor: colors.headerDarkBlue,
    backgroundColor: colors.success,
  },
  title: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.xs,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.md,
    // Room for two lines on every tile ("PMS / Company"), so tiles match
    minHeight: typography.lineHeight.xs * 2,
  },
  tick: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DONE_BLUE,
  },
});

export default RoleTile;
