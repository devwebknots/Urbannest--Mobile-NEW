import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import {
  borderRadius,
  colors,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { GUEST_IMAGE_ASPECT } from '../assets/guestAssets';
import type { Guide } from '../types';

interface Props {
  featured: Guide;
  guides: Guide[];
  onPress?: (id: string) => void;
}

export const GuidesSection: React.FC<Props> = ({
  featured,
  guides,
  onPress,
}) => {
  // Bundled images ignore % / aspectRatio sizing and render at file size,
  // so every image gets exact pixel dimensions.
  const { width } = useWindowDimensions();
  const cardW = width - spacing.screenHorizontal * 2;
  const featured_ = {
    width: cardW,
    height: cardW / GUEST_IMAGE_ASPECT.guideFeatured,
  };
  const thumbW = (cardW - spacing.xl) / 2;
  const thumb = {
    width: thumbW,
    height: thumbW / GUEST_IMAGE_ASPECT.guideThumb,
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.hero, featured_]}
        onPress={() => onPress?.(featured.id)}
        accessibilityRole="button"
      >
        <Image
          source={featured.image}
          style={[styles.abs, featured_]}
          resizeMode="cover"
        />
        <Scrim
          edge="bottom"
          extent={0.6}
          maxOpacity={0.7}
          color={colors.black}
        />
        <View style={styles.heroBody}>
          <View style={styles.flex}>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroMeta}>
              {featured.audience} • {featured.readTime}
            </Text>
          </View>
          <View style={styles.arrow}>
            <ChevronRightIcon size={ms(14)} color={colors.navy} />
          </View>
        </View>
      </Pressable>

      <View style={styles.grid}>
        {guides.map(g => (
          <Pressable
            key={g.id}
            style={{ width: thumbW }}
            onPress={() => onPress?.(g.id)}
            accessibilityRole="button"
          >
            <Image
              source={g.image}
              style={[styles.thumb, thumb]}
              resizeMode="cover"
            />
            <Text style={styles.itemTitle} numberOfLines={2}>
              {g.title}
            </Text>
            <Text style={styles.itemMeta}>
              {g.audience} • {g.readTime}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  abs: { position: 'absolute', top: 0, left: 0 },
  hero: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    justifyContent: 'flex-end',
  },
  heroBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.xl,
  },
  flex: { flex: 1 },
  heroTitle: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(15),
    lineHeight: scaleFont(22),
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
  },
  heroMeta: {
    ...typographyPresets.label,
    marginTop: spacing.sm,
    color: colors.textInverseMuted,
  },
  arrow: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  thumb: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  itemTitle: {
    ...typographyPresets.bodyMedium,
    fontSize: scaleFont(12.5),
    lineHeight: scaleFont(17),
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  itemMeta: {
    ...typographyPresets.caption,
    marginTop: spacing.xs,
  },
});

export default GuidesSection;
