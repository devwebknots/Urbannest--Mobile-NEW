/**
 * CuratedLivingCard: interior photo with the Playfair title over a soft
 * navy fade, then a white body with the story and the gold-rule
 * "Digital Curator Standard" signature.
 */

import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { Scrim } from '@/features/persona/components/Scrim';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  eyebrow: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
  width: number;
}

export const CuratedLivingCard: React.FC<Props> = ({ eyebrow, title, body, image, width }) => {
  const imageHeight = Math.round(width * 0.56);
  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.media, { height: imageHeight }]}>
        <Image source={image} style={{ width, height: imageHeight }} resizeMode="cover" />
        <Scrim edge="bottom" extent={0.6} maxOpacity={0.85} />
        <View style={styles.overlay}>
          <Text style={styles.kicker}>Inside your residence</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.text}>{body}</Text>
        <View style={styles.signature}>
          <View style={styles.rule} />
          <Text style={styles.signatureText}>{eyebrow}</Text>
        </View>
      </View>
    </View>
  );
};

const RADIUS = borderRadius.xl;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    borderRadius: RADIUS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  media: {
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: spacing.xl,
  },
  kicker: {
    ...typographyPresets.eyebrow,
    color: colors.heroAccent,
  },
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.white,
    marginTop: ms(6),
  },
  body: {
    padding: spacing.lg,
  },
  text: {
    ...typographyPresets.body,
    color: colors.textSecondary,
  },
  signature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  rule: {
    width: ms(32),
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.gold,
  },
  signatureText: {
    ...typographyPresets.eyebrow,
    color: colors.navy,
  },
});

export default CuratedLivingCard;
