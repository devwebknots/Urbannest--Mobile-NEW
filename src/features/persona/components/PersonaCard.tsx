/**
 * PersonaCard: full-bleed photo card for one persona (or "Add persona").
 * The photo is wider than the card so it can drift for a parallax effect.
 */

import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BriefcaseIcon, HomeIcon, KeyIcon, PlusIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { scaleFont } from '@/utils/responsive';
import { PERSONA_LAYOUT } from '../constants';
import type { Persona, PersonaIcon, PersonaSlide } from '../types';
import { Scrim } from './Scrim';

interface Props {
  slide: PersonaSlide;
  width: number;
  height: number;
  isActive: boolean;
  /** Horizontal drift of the photo, from -parallax to +parallax */
  parallax: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
}

const P = PERSONA_LAYOUT.parallax;

export const PersonaCard: React.FC<Props> = ({
  slide,
  width,
  height,
  isActive,
  parallax,
  onPress,
}) => {
  const image = slide.kind === 'add' ? slide.image : slide.persona.image;
  const inactive =
    slide.kind === 'persona' && slide.persona.status === 'inactive';
  const label =
    slide.kind === 'add'
      ? 'Add persona'
      : `${slide.persona.title}, ${slide.persona.role}, ${slide.persona.status}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      style={[styles.card, { width, height }, isActive && styles.cardActive]}
    >
      <Animated.Image
        source={image}
        resizeMode="cover"
        style={[
          styles.photo,
          { width: width + P * 2, transform: [{ translateX: parallax }] },
        ]}
      />

      {(inactive || slide.kind === 'add') && <View style={styles.dim} />}
      <Scrim edge="top" extent={0.32} maxOpacity={0.45} color="#000000" />
      <Scrim edge="bottom" extent={0.72} maxOpacity={0.96} />

      {slide.kind === 'add' ? (
        <AddContent />
      ) : (
        <PersonaContent persona={slide.persona} />
      )}
    </Pressable>
  );
};

const PersonaContent: React.FC<{ persona: Persona }> = ({ persona }) => (
  <>
    <View style={styles.topRow}>
      <StatusPill active={persona.status === 'active'} />
      <View style={styles.iconChip}>
        <RoleIcon icon={persona.icon} />
      </View>
    </View>

    <View style={styles.content}>
      <Text style={styles.role}>{persona.role.toUpperCase()}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {persona.title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {persona.description}
      </Text>
      <View style={styles.tags}>
        {persona.tags.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  </>
);

const AddContent: React.FC = () => (
  <View style={styles.addContent}>
    <View style={styles.addRing}>
      <View style={styles.addCore}>
        <PlusIcon size={22} color={colors.white} />
      </View>
    </View>
    <Text style={[styles.role, styles.centerText]}>UNLOCK A NEW ROLE</Text>
    <Text style={[styles.title, styles.centerText]}>Add Persona</Text>
    <Text style={[styles.description, styles.centerText]} numberOfLines={3}>
      Own, manage or service properties? Add another profile to the same
      account.
    </Text>
  </View>
);

const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}>
    <View
      style={[
        styles.pillDot,
        { backgroundColor: active ? colors.success : colors.warning },
      ]}
    />
    <Text
      style={[
        styles.pillText,
        { color: active ? colors.white : colors.warningDark },
      ]}
    >
      {active ? 'ACTIVE' : 'INACTIVE'}
    </Text>
  </View>
);

const RoleIcon: React.FC<{ icon: PersonaIcon }> = ({ icon }) => {
  switch (icon) {
    case 'key':
      return <KeyIcon size={18} color={colors.white} />;
    case 'briefcase':
      return <BriefcaseIcon size={18} color={colors.white} />;
    case 'home':
    default:
      return <HomeIcon size={18} color={colors.white} />;
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.header,
    overflow: 'hidden',
    backgroundColor: colors.headerDarkBlue,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardActive: {
    borderColor: 'rgba(255,255,255,0.28)',
  },
  photo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -P,
    height: '100%',
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,29,58,0.45)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillInactive: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warningLight,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs + 2,
  },
  pillText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xxs,
    letterSpacing: 1.2,
  },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.xl,
  },
  role: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: typography.fontSize.xxs,
    letterSpacing: 1.6,
    color: colors.subtitlePeriwinkle,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.heading.semiBold,
    fontSize: scaleFont(28),
    lineHeight: scaleFont(34),
    color: colors.white,
  },
  description: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    color: colors.textInverseMuted,
    marginTop: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: borderRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tagText: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: typography.fontSize.xxs,
    color: colors.white,
  },
  addContent: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  addRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addCore: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  centerText: {
    textAlign: 'center',
  },
});

export default PersonaCard;
