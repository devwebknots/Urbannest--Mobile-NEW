/**
 * RequestCard: service request with icon tile, details and status pill.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { ServiceRequest } from '../../types';
import { RenterIcon } from './RenterIcon';

const STATUS_STYLE: Record<ServiceRequest['status'], { bg: string; fg: string }> = {
  'In Progress': { bg: colors.warningLight, fg: colors.warningDark },
  Scheduled: { bg: colors.infoLight, fg: colors.primaryDark },
  Resolved: { bg: colors.successLight, fg: colors.successDark },
};

export const RequestCard: React.FC<{ request: ServiceRequest; onPress: () => void }> = ({
  request,
  onPress,
}) => {
  const status = STATUS_STYLE[request.status];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${request.category}: ${request.title}, ${request.status}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <RenterIcon name="faucet" size={ms(28)} color={colors.goldIcon} />
      </View>
      <View style={styles.text}>
        <Text style={styles.category}>{request.category}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {request.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {request.ticket} • {request.opened}
        </Text>
      </View>
      <View style={[styles.status, { backgroundColor: status.bg }]}>
        <Text style={[styles.statusText, { color: status.fg }]}>{request.status}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.screenHorizontal,
    padding: spacing.lg,
    gap: spacing.md + 2,
    borderRadius: borderRadius.xl + 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  icon: {
    width: ms(56),
    height: ms(56),
    borderRadius: borderRadius.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sandTile,
  },
  text: {
    flex: 1,
  },
  category: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(15),
    color: colors.navy,
  },
  title: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(14),
    color: colors.textPrimary,
    marginTop: 1,
  },
  meta: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(11.5),
    color: colors.textSecondary,
    marginTop: ms(4),
  },
  status: {
    alignSelf: 'flex-start',
    height: ms(26),
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    justifyContent: 'center',
  },
  statusText: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(11),
  },
});

export default RequestCard;
