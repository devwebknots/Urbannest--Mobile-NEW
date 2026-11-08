/**
 * ProviderCard: one provider on a utility's providers page (information
 * only). Light tile (same fill / edge as the Check-In tiles):
 *  - square photo thumbnail + name, kind and a short accent rule
 *  - description and tag pills
 *  - contact rows: customer care (tap to call), 24/7 emergency line
 *    (tap to call), website (tap to open) and opening hours
 */

import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ClockIcon, WarningTriangleIcon } from '@/components/icons';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { CARD_BG } from '@/features/guest/components/CardBackground';
import { ArrowUpRightIcon, HeadsetIcon } from '@/features/guest/components/GuestIcons';
import { moderateScale as ms } from '@/utils/responsive';
import type { UtilityProvider } from '../../types';
import { TILE_BG, TILE_BORDER } from '../checkin/CheckInChecklist';
import { ACCENTS } from '../dashboard/ConciergeGrid';

interface Props {
  provider: UtilityProvider;
  onCall: (phone: string) => void;
  onOpenWebsite: (url: string) => void;
}

/** "https://gatewaypower.example.com/" -> "gatewaypower.example.com" */
const hostOf = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const ContactRow: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}> = ({ icon, iconBg, label, value, onPress, accessibilityLabel }) => {
  const body = (
    <>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {onPress ? <ArrowUpRightIcon size={ms(14)} color={colors.textMuted} /> : null}
    </>
  );

  return onPress ? (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${label} ${value}`}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {body}
    </Pressable>
  ) : (
    <View style={styles.row}>{body}</View>
  );
};

export const ProviderCard: React.FC<Props> = ({ provider, onCall, onOpenWebsite }) => {
  const accent = ACCENTS[provider.accent] ?? ACCENTS.navy;
  const emergency = provider.emergency;

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={[styles.thumb, { backgroundColor: accent.bg }]}>
          <Image source={provider.image} style={styles.thumbImage} resizeMode="cover" />
        </View>
        <View style={styles.headText}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.kind}>{provider.kind}</Text>
          <View style={[styles.accentRule, { backgroundColor: accent.fg }]} />
        </View>
      </View>

      <Text style={styles.description}>{provider.description}</Text>

      <View style={styles.tags}>
        {provider.tags.map(tag => (
          <View key={tag} style={[styles.tag, { backgroundColor: accent.bg }]}>
            <Text style={[styles.tagText, { color: accent.fg }]}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <ContactRow
        icon={<HeadsetIcon size={ms(15)} color={colors.navy} />}
        iconBg={colors.chipBlue}
        label="Customer care"
        value={provider.phone}
        onPress={() => onCall(provider.phone)}
        accessibilityLabel={`Call ${provider.name} customer care`}
      />
      {emergency ? (
        <ContactRow
          icon={<WarningTriangleIcon size={ms(14)} color={colors.warningDark} />}
          iconBg={colors.warningLight}
          label="24/7 emergency"
          value={emergency}
          onPress={() => onCall(emergency)}
          accessibilityLabel={`Call ${provider.name} emergency line`}
        />
      ) : null}
      <ContactRow
        icon={<ArrowUpRightIcon size={ms(14)} color={colors.navy} />}
        iconBg={colors.chipBlue}
        label="Website"
        value={hostOf(provider.website)}
        onPress={() => onOpenWebsite(provider.website)}
        accessibilityLabel={`Open ${provider.name} website`}
      />
      <ContactRow
        icon={<ClockIcon size={ms(14)} color={colors.navy} />}
        iconBg={colors.chipBlue}
        label="Opening hours"
        value={provider.hours}
      />
    </View>
  );
};

const THUMB = ms(56);
const ROW_ICON = ms(32);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    ...shadows.md,
    shadowColor: CARD_BG.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  // Photo thumbnail; accent tint shows while it loads
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: ms(14),
    overflow: 'hidden',
  },
  thumbImage: {
    width: THUMB,
    height: THUMB,
  },
  headText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typographyPresets.listingTitle,
  },
  kind: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  accentRule: {
    width: ms(24),
    height: 3,
    marginTop: spacing.sm,
    borderRadius: 2,
  },
  description: {
    ...typographyPresets.body,
    marginTop: spacing.lg,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: ms(5),
    borderRadius: borderRadius.pill,
  },
  tagText: {
    ...typographyPresets.badge,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    backgroundColor: TILE_BORDER,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowIcon: {
    width: ROW_ICON,
    height: ROW_ICON,
    borderRadius: ROW_ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rowLabel: {
    ...typographyPresets.caption,
  },
  rowValue: {
    ...typographyPresets.bodyBold,
    marginTop: 1,
    color: colors.navy,
  },
});

export default ProviderCard;
