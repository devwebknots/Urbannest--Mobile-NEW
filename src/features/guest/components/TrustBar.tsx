import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldIcon } from '@/components/icons';
import { borderRadius, colors, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import { TRUST_POINTS } from '../constants';
import { HeadsetIcon, LockIcon } from './GuestIcons';

const TrustIcon: React.FC<{ id: (typeof TRUST_POINTS)[number]['key'] }> = ({ id }) => {
  const size = ms(16);
  const color = colors.primary;
  if (id === 'verified') return <ShieldIcon size={size} color={color} />;
  if (id === 'secure') return <LockIcon size={size} color={color} />;
  return <HeadsetIcon size={size} color={color} />;
};

export const TrustBar: React.FC = () => (
  <View style={styles.card}>
    {TRUST_POINTS.map(point => (
      <View key={point.key} style={styles.item}>
        <View style={styles.iconWrap}>
          <TrustIcon id={point.key} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{point.title}</Text>
          <Text style={styles.subtitle}>{point.subtitle}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  iconWrap: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: colors.infoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
  },
  text: { flex: 1 },
  title: {
    fontFamily: typography.fontFamily.body.medium,
    fontSize: scaleFont(10.5),
    lineHeight: scaleFont(13),
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  subtitle: {
    fontFamily: typography.fontFamily.body.regular,
    fontSize: scaleFont(8.5),
    lineHeight: scaleFont(11),
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default TrustBar;
