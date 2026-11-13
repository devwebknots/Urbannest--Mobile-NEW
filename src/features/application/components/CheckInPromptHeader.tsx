/**
 * CheckInPromptHeader: top of the "Check-In Process Initiated" pop-up
 * (AppDialog `header`), from the design: the "Urban Nest" lockup (as
 * HeaderBrand, navy text), a short secondary-blue accent line, then the property photo
 * with a dark fade at the bottom and pin + name + unit on it.
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { BrandLockup } from '@/components/BrandLogo';
import { MapPinIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

export const CheckInPromptHeader: React.FC<{
  name: string;
  unit?: string;
  image: number;
}> = ({ name, unit, image }) => (
  <View style={styles.wrap}>
    {/* HeaderBrand's lockup, navy on the white card */}
    <BrandLockup
      label="Urban Nest"
      logoSize={ms(24)}
      gap={spacing.sm}
      textStyle={styles.brand}
    />
    <View style={styles.accent} />
    <View style={styles.photoBox}>
      <Image source={image} style={styles.photo} resizeMode="cover" />
      {/* Dark fade so the white name reads on any photo */}
      <View pointerEvents="none" style={styles.fade} />
      <View style={styles.place}>
        <MapPinIcon size={ms(16)} color={colors.white} />
        <View style={styles.placeText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {unit ? (
            <Text style={styles.unit} numberOfLines={1}>
              {unit}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  </View>
);

// colors.headerDarkBlue (#0B1D3A) as rgb, for the photo fade
const NAVY = '11,29,58';

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  brand: {
    ...typographyPresets.brandTitle,
    color: colors.navy,
  },
  accent: {
    width: ms(40),
    height: 3,
    marginTop: spacing.md,
    borderRadius: 2,
    backgroundColor: `${colors.headerGradientEnd}99`,
  },
  photoBox: {
    alignSelf: 'stretch',
    height: ms(150),
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.tileBlue,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  fade: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `linear-gradient(180deg, rgba(${NAVY},0) 45%, rgba(${NAVY},0.7) 100%)`,
  },
  place: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  placeText: {
    flex: 1,
  },
  name: {
    ...typographyPresets.cardTitle,
    color: colors.white,
  },
  unit: {
    ...typographyPresets.cardSubtitle,
    color: colors.white,
  },
});

export default CheckInPromptHeader;
