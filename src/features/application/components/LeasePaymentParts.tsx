/**
 * Payment Summary page pieces (layout from the "Payment Summary" design,
 * app theme values):
 *  - PaymentHero: eyebrow, Playfair hero title (heroTitleCompact, navy),
 *    line under it, the signed-document illustration on the right (same
 *    art as Offer Received).
 *  - PaymentPropertyCard: white card, rounded photo, name, building icon +
 *    unit, chevron (opens the accepted offer).
 *  - PaymentItemRows: icon tile + label + amount rows with hairlines, for
 *    the "Lease Payment Details" box (OfferSection).
 * Total Summary reuses OfferSection + PaymentRows (chipBlue total strip).
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRightIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { OFFER_DOCUMENT_ASPECT, applicationAssets } from '../assets/applicationAssets';
import type { PaymentItem } from '../hooks/useLeasePayment';
import { ApplicationIcon } from './ApplicationIcon';

/* ---------- Hero ---------- */

export const PaymentHero: React.FC<{ eyebrow: string; title: string; message: string }> = ({
  eyebrow,
  title,
  message,
}) => (
  <View style={styles.hero}>
    <View style={styles.heroText}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.heroTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.heroMessage}>{message}</Text>
    </View>
    <Image source={applicationAssets.offerDocument} style={styles.heroArt} resizeMode="contain" />
  </View>
);

/* ---------- Property ---------- */

export const PaymentPropertyCard: React.FC<{
  name: string;
  unit?: string;
  image: number;
  onPress: () => void;
}> = ({ name, unit, image, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${name}${unit ? `, ${unit}` : ''}. View offer`}
    style={({ pressed }) => [styles.property, pressed && styles.pressed]}
  >
    <Image source={image} style={styles.propertyPhoto} resizeMode="cover" />
    <View style={styles.propertyText}>
      <Text style={styles.propertyName} numberOfLines={2}>
        {name}
      </Text>
      {unit ? (
        <View style={styles.unitRow}>
          <ApplicationIcon name="building" size={ms(14)} color={colors.textSecondary} />
          <Text style={styles.unit} numberOfLines={1}>
            {unit}
          </Text>
        </View>
      ) : null}
    </View>
    <ChevronRightIcon size={ms(16)} color={colors.navy} />
  </Pressable>
);

/* ---------- Payment items ---------- */

export const PaymentItemRows: React.FC<{ items: readonly PaymentItem[] }> = ({ items }) => (
  <View>
    {items.map((item, i) => (
      <View
        key={item.id}
        style={styles.item}
        accessible
        accessibilityLabel={`${item.label}: ${item.value}`}
      >
        <View style={styles.itemTile}>
          <ApplicationIcon name={item.icon} size={ms(18)} color={colors.navy} />
        </View>
        {/* Hairline starts after the tile, as in the design */}
        <View style={[styles.itemBody, i > 0 && styles.itemLine]}>
          <Text style={styles.itemLabel} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={styles.itemValue}>{item.value}</Text>
        </View>
      </View>
    ))}
  </View>
);

const ART = ms(120);
const PHOTO_W = ms(96);
const PHOTO_H = ms(64);
const ITEM_TILE = ms(40);

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.75,
  },
  // Hero
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroText: {
    flex: 1,
  },
  eyebrow: {
    ...typographyPresets.eyebrow,
    color: colors.textSecondary,
  },
  heroTitle: {
    ...typographyPresets.heroTitleCompact,
    marginTop: spacing.xs,
    color: colors.navy,
  },
  heroMessage: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.sm,
  },
  heroArt: {
    width: ART * OFFER_DOCUMENT_ASPECT * 0.85,
    height: ART,
  },
  // Property
  property: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  propertyPhoto: {
    width: PHOTO_W,
    height: PHOTO_H,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.tileBlue,
  },
  propertyText: {
    flex: 1,
  },
  propertyName: {
    ...typographyPresets.listingTitle,
    color: colors.navy,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  unit: {
    ...typographyPresets.cardSubtitle,
    flexShrink: 1,
  },
  // Payment items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemTile: {
    width: ITEM_TILE,
    height: ITEM_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  itemLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  itemLabel: {
    ...typographyPresets.bodyMedium,
    flex: 1,
    color: colors.navy,
  },
  itemValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
});
