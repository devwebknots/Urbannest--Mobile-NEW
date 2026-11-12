/**
 * SubmittedHero: top of the Application Submitted page. One photo scene:
 *  - the white apartment block photo (renter residence_sterling.jpg) on
 *    the right, its deep navy sky continuing edge to edge as the band's
 *    colour (PHOTO_SKY)
 *  - a navy wash from the left so the copy sits on calm sky
 *  - navy glass back button + white "Rental Application"
 *  - the light SuccessCheck (white circle, navy tick, white rings, sparks)
 *  - white "Application Submitted!" + line
 *  - bottom fades into the page tint
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ChevronLeftIcon } from '@/components/icons';
import { SUCCESS_CHECK_BOX_SCALE, SuccessCheck } from '@/components/SuccessCheck';
import { colors, spacing, typographyPresets } from '@/config/theme';
import { renterAssets } from '@/features/renter/assets/renterAssets';
import { moderateScale as ms } from '@/utils/responsive';

/** The photo's sky colour (sampled from residence_sterling.jpg) */
const PHOTO_SKY = '1,58,113';
/** residence_sterling.jpg is 1080 x 1142 */
const PHOTO_ASPECT = 1080 / 1142;
const CHECK = ms(72);
// SuccessCheck's box leaves room around the circle for its ripple
const CHECK_PAD = (CHECK * SUCCESS_CHECK_BOX_SCALE - CHECK) / 2;
const BACK = ms(40);
const FADE = ms(110);

interface Props {
  topInset: number;
  onBack: () => void;
}

export const SubmittedHero: React.FC<Props> = ({ topInset, onBack }) => {
  const { width } = useWindowDimensions();
  const photoW = Math.round(width * 0.86);
  const photoH = Math.round(photoW / PHOTO_ASPECT);

  return (
    <View style={[styles.band, { minHeight: photoH, paddingTop: topInset + spacing.sm }]}>
      <Image
        source={renterAssets.sterling}
        style={[styles.photo, { width: photoW, height: photoH, right: -width * 0.1 }]}
        resizeMode="cover"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      {/* Navy wash from the left, then the fade into the page */}
      <View pointerEvents="none" style={styles.wash} />
      <View pointerEvents="none" style={styles.fade} />

      <View style={styles.bar}>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to property"
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ChevronLeftIcon size={ms(18)} color={colors.white} />
        </Pressable>
        <Text style={styles.barTitle} numberOfLines={1}>
          Rental Application
        </Text>
      </View>

      <View style={styles.copy}>
        <View style={styles.check}>
          <SuccessCheck size={CHECK} tone="light" />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Application{'\n'}Submitted!
        </Text>
        <Text style={styles.subtitle}>
          Your rental application has been successfully submitted to the property manager.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: FADE,
    backgroundColor: `rgb(${PHOTO_SKY})`,
  },
  photo: {
    position: 'absolute',
    bottom: 0,
  },
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `linear-gradient(90deg, rgba(${PHOTO_SKY},1) 0%, rgba(${PHOTO_SKY},0.92) 34%, rgba(${PHOTO_SKY},0.35) 62%, rgba(${PHOTO_SKY},0) 82%)`,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FADE,
    backgroundImage: `linear-gradient(180deg, rgba(238,243,249,0) 0%, ${colors.pageTint} 92%)`,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Same navy glass circle as the other dark headers (NavyPageHeader)
  back: {
    width: BACK,
    height: BACK,
    borderRadius: BACK / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,29,58,0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  barTitle: {
    ...typographyPresets.sectionTitle,
    flex: 1,
    marginLeft: spacing.lg,
    color: colors.white,
  },
  copy: {
    marginTop: spacing.lg,
    maxWidth: '68%',
  },
  // Line the circle (not its ring room) up with the text
  check: {
    marginLeft: -CHECK_PAD,
    marginTop: -CHECK_PAD + spacing.sm,
    marginBottom: -CHECK_PAD + spacing.lg,
  },
  title: {
    ...typographyPresets.heroTitle,
  },
  subtitle: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.sm,
  },
});

export default SubmittedHero;
