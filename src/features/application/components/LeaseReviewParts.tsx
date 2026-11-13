/**
 * Lease Review page pieces (layout from the "Lease Document" design, app
 * theme values):
 *  - LeaseIntroCard: round tileBlue icon (page + signature), Playfair title
 *    and line; same card as Offer Received / Current Status (white,
 *    TILE_BORDER rim, soft blue swell in the bottom-right corner).
 *  - FileCard: the shared FileBar in its own white card (same card as the
 *    Offer Acceptance sections: borderLight rim, shadows.sm).
 * The lease itself is the shared LeaseDocumentPaper, laid on the page.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typographyPresets } from '@/config/theme';
import { TILE_BORDER } from '@/features/renter/components/checkin/CheckInChecklist';
import { moderateScale as ms } from '@/utils/responsive';
import { ApplicationIcon } from './ApplicationIcon';
import { FileBar } from './SubmittedApplicationParts';

// colors.headerGradientEnd (#518EF9) as rgb, for the swell
const BLUE = '81,142,249';

export const LeaseIntroCard: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => (
  <View style={styles.intro}>
    <View style={styles.introIcon}>
      <ApplicationIcon name="fileSignature" size={ms(28)} color={colors.navy} />
    </View>
    <View style={styles.introText}>
      <Text style={styles.introTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.introMessage}>{message}</Text>
    </View>
  </View>
);

export const FileCard: React.FC<React.ComponentProps<typeof FileBar>> = props => (
  <View style={styles.fileCard}>
    <FileBar {...props} divider={false} />
  </View>
);

const INTRO_ICON = ms(60);

const styles = StyleSheet.create({
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: TILE_BORDER,
    backgroundColor: colors.white,
    overflow: 'hidden',
    // Soft blue swell in the bottom-right corner (the design's wave)
    backgroundImage: `radial-gradient(circle at 105% 120%, rgba(${BLUE},0.28) 0%, rgba(${BLUE},0.08) 45%, rgba(${BLUE},0) 70%)`,
  },
  introIcon: {
    width: INTRO_ICON,
    height: INTRO_ICON,
    borderRadius: INTRO_ICON / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tileBlue,
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    ...typographyPresets.sectionHeading,
    color: colors.navy,
  },
  introMessage: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xs,
  },
  // Same card as the Offer Acceptance sections
  fileCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
});
