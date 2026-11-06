/**
 * ConciergeGrid: 3 + 2 tiles in alternating cool-blue / warm-sand tints.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '@/config/theme';
import { moderateScale as ms, scaleFont } from '@/utils/responsive';
import type { ConciergeService } from '../../types';
import { RenterIcon } from './RenterIcon';

interface Props {
  services: readonly ConciergeService[];
  onPress: (service: ConciergeService) => void;
}

const Tile: React.FC<{ service: ConciergeService; onPress: () => void }> = ({
  service,
  onPress,
}) => {
  const sand = service.tone === 'sand';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={service.label}
      style={({ pressed }) => [
        styles.tile,
        sand ? styles.tileSand : styles.tileBlue,
        pressed && styles.pressed,
      ]}
    >
      <RenterIcon
        name={service.icon}
        size={ms(30)}
        color={sand ? colors.goldIcon : colors.navy}
      />
      <Text style={styles.label} numberOfLines={1}>
        {service.label}
      </Text>
    </Pressable>
  );
};

export const ConciergeGrid: React.FC<Props> = ({ services, onPress }) => {
  const rows = [services.slice(0, 3), services.slice(3)];
  return (
    <View style={styles.root}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map(s => (
            <Tile key={s.id} service={s} onPress={() => onPress(s)} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    height: ms(104),
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.95)',
    ...shadows.md,
  },
  tileBlue: {
    backgroundColor: colors.blueTile,
  },
  tileSand: {
    backgroundColor: colors.sandTile,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontFamily: typography.fontFamily.body.semiBold,
    fontSize: scaleFont(13.5),
    color: colors.navy,
  },
});

export default ConciergeGrid;
