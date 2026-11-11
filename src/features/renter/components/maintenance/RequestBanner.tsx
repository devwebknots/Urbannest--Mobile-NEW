/**
 * RequestBanner: "Need a Fix?" call-out on the Maintenance page.
 * One compact row, like the design: navy wrench badge with a soft halo,
 * title + two-line text, and a small "+ Request" button on the right.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { PlusIcon } from '@/components/icons';
import { colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon } from '../dashboard/RenterIcon';
import { TILE_BG } from '../checkin/CheckInChecklist';
import { CARD_RADIUS } from './cardStyle';

interface Props {
  onNewRequest: () => void;
}

export const RequestBanner: React.FC<Props> = ({ onNewRequest }) => (
  <View style={styles.card}>
    <View style={styles.halo}>
      <View style={styles.badge}>
        <RenterIcon name="lineWrench" size={ms(20)} color={colors.white} />
      </View>
    </View>
    <View style={styles.copy}>
      <Text style={styles.title} numberOfLines={1}>
        Need a Fix?
      </Text>
      <Text style={styles.body} numberOfLines={2}>
        Submit a request and our concierge team will handle the rest.
      </Text>
    </View>
    <Button
      title="Request"
      accessibilityLabel="New maintenance request"
      variant="brand"
      size="md"
      onPress={onNewRequest}
      leftIcon={<PlusIcon size={ms(13)} color={colors.white} />}
      style={styles.button}
    />
  </View>
);

const BADGE = ms(40);
const HALO = ms(5);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundImage: `linear-gradient(135deg, ${colors.chipBlue} 0%, ${TILE_BG} 100%)`,
    boxShadow: '0px 10px 24px rgba(11,29,58,0.07)',
  },
  // Soft blue ring around the badge
  halo: {
    padding: HALO,
    borderRadius: (BADGE + HALO * 2) / 2,
    backgroundColor: 'rgba(81,142,249,0.16)',
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(135deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
  },
  copy: {
    flex: 1,
  },
  title: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  body: {
    ...typographyPresets.cardSubtitle,
    marginTop: spacing.xxs,
  },
  // Compact button, like the design (Button md is 44 high)
  button: {
    height: ms(36),
    paddingHorizontal: spacing.md,
  },
});

export default RequestBanner;
