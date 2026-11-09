/**
 * CountdownRing: days-left ring for the rent card. One small tick per day
 * of the billing cycle, laid around a circle (plain Views, no SVG): days
 * already passed are bright, the days left are faint, the due day is gold.
 * The number of days left sits in the middle.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

interface Props {
  daysLeft: number;
  cycleDays: number;
  size?: number;
}

export const CountdownRing: React.FC<Props> = ({ daysLeft, cycleDays, size = ms(92) }) => {
  const passed = Math.max(0, cycleDays - daysLeft);
  const tickW = ms(3);
  const tickH = ms(9);
  // Ticks sit on a circle just inside the edge
  const r = size / 2 - tickH / 2;
  const c = size / 2;

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityRole="progressbar"
      accessibilityLabel={`${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`}
    >
      {Array.from({ length: cycleDays }, (_, i) => {
        const a = (i / cycleDays) * Math.PI * 2;
        const x = c + r * Math.sin(a);
        const y = c - r * Math.cos(a);
        const isDue = i === cycleDays - 1;
        const color = isDue ? colors.heroAccent : i < passed ? colors.white : 'rgba(255,255,255,0.22)';
        return (
          <View
            key={i}
            style={[
              styles.tick,
              {
                width: tickW,
                height: tickH,
                left: x - tickW / 2,
                top: y - tickH / 2,
                backgroundColor: color,
                transform: [{ rotate: `${(i / cycleDays) * 360}deg` }],
              },
            ]}
          />
        );
      })}
      <View style={styles.center}>
        <Text style={styles.days}>{daysLeft}</Text>
        <Text style={styles.label}>{daysLeft === 1 ? 'day left' : 'days left'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tick: {
    position: 'absolute',
    borderRadius: 2,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  days: {
    ...typographyPresets.heroTitleCompact,
  },
  label: {
    ...typographyPresets.badge,
    color: 'rgba(199,210,254,0.85)',
  },
});

export default CountdownRing;
