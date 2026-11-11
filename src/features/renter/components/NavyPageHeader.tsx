/**
 * NavyPageHeader: navy gradient band at the top of a pushed renter page
 * (Ticket Details). App back button (navy glass circle, white chevron, as
 * on the Manage / Check-In headers), white title + subtitle, faint white
 * building line art on the right. The page content goes in `children`:
 * it sits on a pale sheet with rounded top corners that overlaps the
 * bottom of the band.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, gradients, borderRadius, spacing, typographyPresets } from '@/config/theme';
import { ChevronLeftIcon } from '@/components/icons';
import { moderateScale as ms } from '@/utils/responsive';
import { HEADER_BUILDINGS_ASPECT, renterAssets } from '../assets/renterAssets';

interface Props {
  title: string;
  subtitle?: string;
  topInset: number;
  onBack: () => void;
  backLabel?: string;
  children: React.ReactNode;
}

/** How far the sheet overlaps the band (= its corner radius) */
const SHEET_OVERLAP = borderRadius.header;
const ART_WIDTH = ms(210);
const BACK = ms(40);

export const NavyPageHeader: React.FC<Props> = ({
  title,
  subtitle,
  topInset,
  onBack,
  backLabel = 'Back',
  children,
}) => (
  <View>
    <View style={[styles.band, { paddingTop: topInset + spacing.md }]}>
      <Image
        source={renterAssets.headerBuildings}
        style={styles.art}
        resizeMode="contain"
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
      <View style={styles.row}>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <ChevronLeftIcon size={ms(18)} color={colors.white} />
        </Pressable>
        <View style={styles.copy}>
          <Text style={styles.title} accessibilityRole="header" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>

    <View style={styles.sheet}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  band: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: SHEET_OVERLAP + spacing.xxl,
    overflow: 'hidden',
    backgroundImage: `linear-gradient(120deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  // Line art sits on the sheet edge, right side
  art: {
    position: 'absolute',
    right: 0,
    bottom: SHEET_OVERLAP - ms(4),
    width: ART_WIDTH,
    height: ART_WIDTH / HEADER_BUILDINGS_ASPECT,
    opacity: 0.55,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Same navy glass circle as the Manage / Check-In headers (DetailTopBar)
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
  copy: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typographyPresets.heroTitleCompact,
  },
  subtitle: {
    ...typographyPresets.heroSubtitle,
    marginTop: spacing.xs,
  },
  sheet: {
    marginTop: -SHEET_OVERLAP,
    paddingTop: spacing.xl,
    borderTopLeftRadius: SHEET_OVERLAP,
    borderTopRightRadius: SHEET_OVERLAP,
    backgroundColor: colors.pageTint,
  },
});

export default NavyPageHeader;
