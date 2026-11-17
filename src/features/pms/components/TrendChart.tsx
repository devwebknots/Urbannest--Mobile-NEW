/**
 * TrendChart: small area line chart drawn with plain Views (no SVG in the
 * app): faint vertical grid, a soft secondary-blue area under the line (thin
 * gradient slices), the line as rotated segments, and dots on each value
 * (the latest one larger). Fills the width it is given.
 */

import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

// colors.headerGradientEnd (#518EF9, app secondary blue) as rgb
const BLUE = '81,142,249';
const LINE = ms(2.5);
const DOT = ms(7);
const DOT_LAST = ms(10);
/** Area slices across the width (more = smoother) */
const SLICES = 60;

interface Props {
  values: readonly number[];
  height?: number;
  color?: string;
}

export const TrendChart: React.FC<Props> = ({
  values,
  height = ms(64),
  color = colors.headerGradientEnd,
}) => {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    setWidth(prev => (prev === w ? prev : w));
  };

  const pad = DOT_LAST / 2 + 1;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points =
    width > 0 && values.length > 1
      ? values.map((v, i) => ({
          x: pad + (i * (width - pad * 2)) / (values.length - 1),
          y: pad + (1 - (v - min) / span) * (height - pad * 2),
        }))
      : [];

  /** Line height at any x (straight between points) */
  const yAt = (x: number) => {
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (x <= b.x) {
        const t = (x - a.x) / (b.x - a.x || 1);
        return a.y + (b.y - a.y) * Math.max(0, Math.min(1, t));
      }
    }
    return points[points.length - 1]?.y ?? height;
  };

  const first = points[0];
  const last = points[points.length - 1];

  return (
    <View
      style={[styles.chart, { height }]}
      onLayout={onLayout}
      accessible
      accessibilityRole="image"
      accessibilityLabel="Net income trend, rising"
    >
      {points.map((p, i) => (
        <View key={`g${i}`} style={[styles.grid, { left: p.x }]} />
      ))}

      {first && last
        ? Array.from({ length: SLICES }, (_, i) => {
            const x0 = first.x + ((last.x - first.x) * i) / SLICES;
            const w = (last.x - first.x) / SLICES + 0.6;
            const top = yAt(x0 + w / 2);
            return (
              <View
                key={`a${i}`}
                style={[styles.slice, { left: x0, width: w, top }]}
              />
            );
          })
        : null}

      {points.slice(1).map((b, i) => {
        const a = points[i];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        return (
          <View
            key={`l${i}`}
            style={[
              styles.segment,
              {
                width: len + LINE / 2,
                left: (a.x + b.x) / 2 - (len + LINE / 2) / 2,
                top: (a.y + b.y) / 2 - LINE / 2,
                backgroundColor: color,
                transform: [{ rotate: `${angle}rad` }],
              },
            ]}
          />
        );
      })}

      {points.map((p, i) => {
        const size = i === points.length - 1 ? DOT_LAST : DOT;
        return (
          <View
            key={`d${i}`}
            style={[
              styles.dot,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                left: p.x - size / 2,
                top: p.y - size / 2,
                borderColor: color,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    width: '100%',
  },
  grid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(81,142,249,0.18)',
  },
  slice: {
    position: 'absolute',
    bottom: 0,
    backgroundImage: `linear-gradient(180deg, rgba(${BLUE},0.3) 0%, rgba(${BLUE},0.04) 100%)`,
  },
  segment: {
    position: 'absolute',
    height: LINE,
    borderRadius: LINE / 2,
  },
  dot: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderWidth: 2,
  },
});

export default TrendChart;
