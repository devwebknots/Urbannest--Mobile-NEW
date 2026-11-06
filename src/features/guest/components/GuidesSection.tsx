import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
import type { Guide } from '../types';

interface Props {
  featured: Guide;
  guides: Guide[];
  onPress?: (id: string) => void;
}

export const GuidesSection: React.FC<Props> = ({ featured, guides, onPress }) => (
  <View style={styles.wrap}>
    <Pressable style={styles.hero} onPress={() => onPress?.(featured.id)} accessibilityRole="button">
      <Image source={{ uri: featured.image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <Scrim edge="bottom" extent={0.7} maxOpacity={0.85} color={colors.black} />
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
        <Pressable key={g.id} style={styles.item} onPress={() => onPress?.(g.id)} accessibilityRole="button">
          <Image source={{ uri: g.image }} style={styles.thumb} resizeMode="cover" />
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

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  hero: {
    height: ms(200),
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
  item: {
    flex: 1,
  },
  thumb: {
    width: '100%',
    height: ms(96),
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
