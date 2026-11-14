/**
 * CommunicationHub: dark navy panel with the latest messages from the
 * estate manager / maintenance team, an "N new" pill and "Open Messenger".
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { HubMessage } from '../types';
import { CardTitle } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

export const CommunicationHub: React.FC<{
  messages: readonly HubMessage[];
  onOpenMessage: (message: HubMessage) => void;
  onOpenMessenger: () => void;
}> = ({ messages, onOpenMessage, onOpenMessenger }) => {
  const unread = messages.filter(m => m.unread).length;

  return (
    <View style={styles.panel}>
      <View style={styles.glow} pointerEvents="none" />
      <CardTitle
        icon="message"
        title="Communication Hub"
        color={colors.white}
        iconColor={colors.white}
        right={
          unread > 0 ? (
            <View style={styles.newPill}>
              <Text style={[typographyPresets.badge, styles.white]}>{unread} new</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.list}>
        {messages.map(m => (
          <Pressable
            key={m.id}
            onPress={() => onOpenMessage(m)}
            accessibilityRole="button"
            accessibilityLabel={`${m.sender}: ${m.message}`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.avatar}>
              <LandlordIcon name={m.icon} size={ms(18)} color={colors.white} />
            </View>
            <View style={styles.copy}>
              <View style={styles.head}>
                <Text style={[typographyPresets.bodyBold, styles.sender]} numberOfLines={1}>
                  {m.sender}
                </Text>
                <Text style={[typographyPresets.caption, styles.time]}>{m.time}</Text>
                {m.unread ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={[typographyPresets.heroSubtitle, styles.message]} numberOfLines={2}>
                {m.message}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Button
        title="Open Messenger"
        variant="glass"
        size="md"
        onPress={onOpenMessenger}
        style={styles.cta}
        leftIcon={<LandlordIcon name="message" size={ms(16)} color={colors.white} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    padding: spacing.lg,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    backgroundImage: `linear-gradient(135deg, ${colors.headerDarkBlue} 0%, ${colors.navy} 100%)`,
    boxShadow: '0px 10px 24px rgba(11,29,58,0.18)',
  },
  // Soft secondary-blue light in the bottom right corner
  glow: {
    ...StyleSheet.absoluteFill,
    backgroundImage: `radial-gradient(circle at 100% 110%, rgba(81,142,249,0.35) 0%, rgba(81,142,249,0) 55%)`,
  },
  newPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: ms(3),
    borderRadius: borderRadius.pill,
    backgroundImage: `linear-gradient(90deg, ${gradients.button[1]} 0%, ${colors.headerGradientEnd} 100%)`,
  },
  white: {
    color: colors.white,
  },
  list: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pressed: {
    opacity: 0.8,
  },
  avatar: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  copy: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sender: {
    flex: 1,
    color: colors.white,
  },
  time: {
    color: colors.textInverseMuted,
  },
  unreadDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
    backgroundColor: colors.headerGradientEnd,
  },
  message: {
    marginTop: ms(2),
  },
  cta: {
    marginTop: spacing.lg,
  },
});

export default CommunicationHub;
