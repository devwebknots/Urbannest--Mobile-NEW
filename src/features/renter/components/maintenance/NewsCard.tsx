/**
 * NewsCard: "News & Alerts" photo card on the Maintenance page. Full
 * photo with a navy fade from the left; gold tag pill, white Playfair
 * title and a short line on the left, round white arrow at bottom right.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { ArrowRightIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import { CircleIconButton } from '../CircleIconButton';
import type { MaintenanceNews } from '../../types';
import { CARD_RADIUS } from './cardStyle';

interface Props {
  item: MaintenanceNews;
  /** Screen width */
  width: number;
  onPress: (item: MaintenanceNews) => void;
}

export const NewsCard: React.FC<Props> = ({ item, width, onPress }) => {
  const cardWidth = width - spacing.screenHorizontal * 2;
  const cardHeight = Math.round(ms(196));
  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.tag}: ${item.title}`}
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth, height: cardHeight },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={item.image}
        style={[styles.photo, { width: cardWidth, height: cardHeight }]}
        resizeMode="cover"
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.fade]} />

      <View style={styles.copy}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {item.body}
        </Text>
      </View>

      <View style={styles.arrow}>
        <CircleIconButton
          variant="solid"
          size={ms(40)}
          onPress={() => onPress(item)}
          accessibilityLabel={`Read ${item.title}`}
          icon={<ArrowRightIcon size={ms(16)} color={colors.navy} />}
        />
      </View>
    </Pressable>
  );
};

// colors.headerDarkBlue (#0B1D3A) as rgb, for the fade
const NAVY = '11,29,58';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.headerDarkBlue,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fade: {
    backgroundImage: `linear-gradient(to right, rgba(${NAVY},0.96) 0%, rgba(${NAVY},0.82) 45%, rgba(${NAVY},0.15) 100%)`,
  },
  copy: {
    width: '72%',
    padding: spacing.lg,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.warningLight,
  },
  tagText: {
    ...typographyPresets.badge,
    color: colors.warningDark,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    ...typographyPresets.sectionHeading,
    marginTop: spacing.sm,
    color: colors.white,
  },
  body: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.xs,
  },
  arrow: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
});

export default NewsCard;
