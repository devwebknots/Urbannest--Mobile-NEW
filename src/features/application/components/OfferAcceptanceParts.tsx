/**
 * Offer Acceptance page pieces (layout from the "Offer Acceptance" design,
 * app theme values):
 *  - OfferPhoto: the property photo, full width, rounded.
 *  - OfferReceivedCard: secondary-blue accent bar, Playfair title and line,
 *    the design's signed-document illustration on the right over a soft
 *    blue swell.
 *  - OfferPropertyRow: tileBlue building tile, name + address, category
 *    chip on the right.
 *  - OfferSection: heading + line on the page (as "Application Journey"),
 *    content in a white box under it. Used for Lease Information and
 *    Payment Details:
 *    - LeaseFactsRow: three columns (round icon, label, value) split by
 *      hairlines.
 *    - PaymentRows: label / amount rows with hairlines, then the total in
 *      a chipBlue strip (as "Net Due Today").
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { OFFER_DOCUMENT_ASPECT, applicationAssets } from '../assets/applicationAssets';
import type { LeaseFact, PaymentLine } from '../hooks/useOfferAcceptance';
import { ApplicationIcon } from './ApplicationIcon';

// colors.headerGradientEnd (#518EF9) as rgb, for the swell and header bands
const BLUE = '81,142,249';

/* ---------- Photo ---------- */

export const OfferPhoto: React.FC<{ source: number; label: string }> = ({ source, label }) => (
  <Image
    source={source}
    style={styles.photo}
    resizeMode="cover"
    accessible
    accessibilityLabel={label}
  />
);

/* ---------- Offer received ---------- */

export const OfferReceivedCard: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <View style={styles.received}>
    <View style={styles.accent} />
    <View style={styles.receivedText}>
      <Text style={styles.receivedTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.receivedMessage}>{message}</Text>
    </View>
    <Image source={applicationAssets.offerDocument} style={styles.receivedArt} resizeMode="contain" />
  </View>
);

/* ---------- Property ---------- */

export const OfferPropertyRow: React.FC<{
  name: string;
  address: string;
  category?: string;
}> = ({ name, address, category }) => (
  <View style={styles.property}>
    <View style={styles.propertyTile}>
      <ApplicationIcon name="building" size={ms(24)} color={colors.navy} />
    </View>
    <View style={styles.propertyText}>
      <View style={styles.propertyNameRow}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {name}
        </Text>
        {category ? (
          <View style={styles.chip}>
            <Text style={styles.chipText} numberOfLines={1}>
              {category}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.propertyAddress} numberOfLines={2}>
        {address}
      </Text>
    </View>
  </View>
);

/* ---------- Lease / payment sections ---------- */

/**
 * Section heading + line on the page (as "Application Journey" on
 * Application Details), content in a white box under it
 */
export const OfferSection: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <View>
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {title}
    </Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    <View style={styles.box}>{children}</View>
  </View>
);

export const LeaseFactsRow: React.FC<{ facts: readonly LeaseFact[] }> = ({ facts }) => (
  <View style={styles.facts}>
    {facts.map((f, i) => (
      <View
        key={f.id}
        style={[styles.fact, i > 0 && styles.factLine]}
        accessible
        accessibilityLabel={`${f.label}: ${f.value}`}
      >
        <View style={styles.factIcon}>
          <ApplicationIcon name={f.icon} size={ms(16)} color={colors.navy} />
        </View>
        <View style={styles.factText}>
          <Text
            style={styles.factLabel}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {f.label}
          </Text>
          <Text
            style={styles.factValue}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
          >
            {f.value}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

/**
 * Payment lines as on Review's "Application Fee": label / amount rows with
 * hairlines between, then the total ("One Time Payment") in a chipBlue strip
 */
export const PaymentRows: React.FC<{ lines: readonly PaymentLine[] }> = ({ lines }) => {
  const rows = lines.filter(l => !l.highlight);
  const total = lines.find(l => l.highlight);
  return (
    <>
      <View>
        {rows.map((l, i) => (
          <View
            key={l.id}
            style={[styles.payment, i > 0 && styles.paymentLine]}
            accessible
            accessibilityLabel={`${l.label}: ${l.value}`}
          >
            <Text style={styles.paymentLabel}>{l.label}</Text>
            <Text style={styles.paymentValue}>{l.value}</Text>
          </View>
        ))}
      </View>
      {total ? (
        <View
          style={styles.total}
          accessible
          accessibilityLabel={`${total.label}: ${total.value}`}
        >
          <Text style={styles.totalLabel}>{total.label}</Text>
          <Text style={styles.totalValue}>{total.value}</Text>
        </View>
      ) : null}
    </>
  );
};

const ART = ms(78);
const PROPERTY_TILE = ms(52);
const FACT_ICON = ms(34);

const styles = StyleSheet.create({
  // Photo
  photo: {
    width: '100%',
    height: ms(190),
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.tileBlue,
  },
  // Offer received
  received: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    overflow: 'hidden',
    // Soft blue swell in the bottom-right corner (the design's wave)
    backgroundImage: `radial-gradient(circle at 105% 120%, rgba(${BLUE},0.28) 0%, rgba(${BLUE},0.08) 45%, rgba(${BLUE},0) 70%)`,
  },
  accent: {
    alignSelf: 'stretch',
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.headerGradientEnd,
  },
  receivedText: {
    flex: 1,
  },
  receivedTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  receivedMessage: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  receivedArt: {
    width: ART * OFFER_DOCUMENT_ASPECT,
    height: ART,
  },
  // Property
  property: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  propertyTile: {
    width: PROPERTY_TILE,
    height: PROPERTY_TILE,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  propertyText: {
    flex: 1,
  },
  propertyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  propertyName: {
    ...typographyPresets.listingTitle,
    flex: 1,
    color: colors.navy,
  },
  propertyAddress: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(2),
  },
  chip: {
    flexShrink: 1,
    maxWidth: '50%',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: ms(4),
    borderRadius: borderRadius.pill,
    backgroundColor: colors.chipBlue,
  },
  chipText: {
    ...typographyPresets.badge,
    color: colors.navy,
  },
  // Sections: heading outside, white box (as the journey step cards)
  sectionTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  sectionSubtitle: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  // Same card as Application Status / journey steps: borderLight rim, shadows.sm
  box: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  // Lease facts: three columns, hairlines between. Icon sits above the
  // text so labels / dates get the column's full width (side by side,
  // "Move-in Date" was cut off on phones)
  facts: {
    flexDirection: 'row',
  },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  factLine: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: TILE_BORDER,
  },
  factIcon: {
    width: FACT_ICON,
    height: FACT_ICON,
    borderRadius: FACT_ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  factText: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  factLabel: {
    ...typographyPresets.label,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  factValue: {
    ...typographyPresets.fieldLabel,
    marginTop: ms(1),
    color: colors.navy,
    textAlign: 'center',
  },
  // Payments (as Review's "Application Fee" rows)
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  paymentLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: TILE_BORDER,
  },
  paymentLabel: {
    ...typographyPresets.body,
    flex: 1,
    color: colors.textPrimary,
  },
  paymentValue: {
    ...typographyPresets.bodyBold,
    color: colors.navy,
  },
  // One Time Payment: chipBlue strip (as "Net Due Today")
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
    marginHorizontal: -spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.chipBlue,
  },
  totalLabel: {
    ...typographyPresets.cardTitle,
    flex: 1,
    color: colors.navy,
  },
  totalValue: {
    ...typographyPresets.price,
    color: colors.navy,
  },
});
