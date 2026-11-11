/**
 * PropertyDetailsCard: compact "Details" card on the guest search card's
 * background (CardBackground: frosted light blue, white glow, soft blue
 * waves). Small title + short description, the 3D floor plan underneath
 * (all edges faded so it sits on the waves) and a "View Floor Plan" pill.
 */

import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
  typographyPresets,
} from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { PROPERTY_IMAGE_ASPECT } from '../../assets/guestAssets';
import { CARD_BG, CardBackground } from '../CardBackground';
import { PropertyIcon } from './PropertyIcon';

interface Props {
  description: string;
  floorPlan: ImageSourcePropType;
  onViewFloorPlan: () => void;
}

/** Floor plan width as a share of the card */
const PLAN_SHARE = 0.86;

export const PropertyDetailsCard: React.FC<Props> = ({
  description,
  floorPlan,
  onViewFloorPlan,
}) => {
  const { width } = useWindowDimensions();
  const planW = Math.round((width - spacing.screenHorizontal * 2) * PLAN_SHARE);
  const planH = Math.round(planW / PROPERTY_IMAGE_ASPECT.floorPlan);

  return (
    <View style={styles.card}>
      <CardBackground />

      <Text style={styles.title} accessibilityRole="header">
        Details
      </Text>
      <Text style={styles.description}>{description}</Text>

      <Image
        source={floorPlan}
        style={[styles.plan, { width: planW, height: planH }]}
        resizeMode="contain"
        accessibilityLabel="Floor plan"
      />

      <Pressable
        onPress={onViewFloorPlan}
        accessibilityRole="button"
        accessibilityLabel="View Floor Plan"
        style={({ pressed }) => [styles.planButton, pressed && styles.pressed]}
      >
        <PropertyIcon name="openExternal" size={ms(13)} color={colors.navy} />
        <Text style={styles.planButtonText}>View Floor Plan</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  // Same shell as the guest search card
  card: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
    borderRadius: borderRadius.xxl,
    backgroundColor: CARD_BG.base,
    borderWidth: 1.5,
    borderColor: CARD_BG.edge,
    ...shadows.lg,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
  // Same heading as the other sections (Costs & Fees, Special features, ...)
  title: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  description: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  plan: {
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
  planButton: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    height: ms(30),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.white,
    ...shadows.md,
  },
  planButtonText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11.5),
    color: colors.navy,
    fontWeight: typography.fontWeight.semibold,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});

export default PropertyDetailsCard;
