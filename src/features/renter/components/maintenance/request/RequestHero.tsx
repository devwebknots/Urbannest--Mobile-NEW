/**
 * RequestHero: "Need a Fix? We're Here." card at the top of the
 * maintenance request form. Pale blue card: white rounded icon box (app
 * standard, like the Check-In tiles) with the wrench,
 * navy Playfair headline and a short line on the left; a
 * building photo (with its soft sky arc) on the right melting into the
 * card.
 */

import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon } from '../../dashboard/RenterIcon';
import { CARD_RADIUS } from '../cardStyle';

interface Props {
  image: ImageSourcePropType;
  /** Screen width */
  width: number;
}

export const RequestHero: React.FC<Props> = ({ image, width }) => {
  const cardWidth = width - spacing.screenHorizontal * 2;
  const height = Math.round(ms(176));
  const photoWidth = Math.round(cardWidth * 0.52);
  return (
    <View style={[styles.card, { height }]}>
      <View pointerEvents="none" style={[styles.photo, { width: photoWidth }]}>
        <Image source={image} style={{ width: photoWidth, height }} resizeMode="cover" />
        <View style={[StyleSheet.absoluteFill, styles.fade]} />
      </View>

      <View style={styles.copy}>
        <View style={styles.badge}>
          <RenterIcon name="wrench" size={ms(20)} color={colors.navy} />
        </View>
        <Text style={styles.title}>Need a Fix?{'\n'}We're Here.</Text>
        <Text style={styles.body}>Raise a maintenance request and get it resolved quickly.</Text>
      </View>
    </View>
  );
};

// colors.chipBlue (#DCE8FB) as rgb, for the photo fade
const CHIP = '220,232,251';
const BADGE = ms(38);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: colors.chipBlue,
    borderWidth: 1,
    borderColor: colors.white,
  },
  photo: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },
  fade: {
    backgroundImage: `linear-gradient(to right, rgba(${CHIP},1) 0%, rgba(${CHIP},0.4) 30%, rgba(${CHIP},0) 60%)`,
  },
  copy: {
    flex: 1,
    width: '62%',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    boxShadow: '0px 4px 10px rgba(11,29,58,0.10)',
  },
  title: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.sm,
    color: colors.navy,
  },
  body: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
    color: colors.textPrimary,
  },
});

export default RequestHero;
