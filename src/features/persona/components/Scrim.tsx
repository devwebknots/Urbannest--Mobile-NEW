/**
 * Scrim: smooth fade from transparent to a color.
 * Uses one stretched gradient image (fade.png, alpha 0 -> 1, top -> bottom)
 * tinted to the wanted color, so there are no visible bands.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors } from '@/config/theme';

const FADE = require('@/assets/images/personas/fade.png');

interface Props {
  /** Edge the fade is darkest at */
  edge: 'top' | 'bottom';
  /** Share of the parent height the fade covers (0-1) */
  extent: number;
  /** Opacity at the darkest edge */
  maxOpacity: number;
  color?: string;
}

export const Scrim: React.FC<Props> = ({
  edge,
  extent,
  maxOpacity,
  color = colors.headerDarkBlue,
}) => (
  <View
    pointerEvents="none"
    style={[
      styles.wrap,
      edge === 'bottom' ? styles.bottom : styles.top,
      { height: `${Math.round(extent * 100)}%`, opacity: maxOpacity },
    ]}
  >
    <Image
      source={FADE}
      resizeMode="stretch"
      style={[styles.fill, { tintColor: color }, edge === 'top' && styles.flip]}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  top: { top: 0 },
  bottom: { bottom: 0 },
  fill: {
    width: '100%',
    height: '100%',
  },
  flip: {
    transform: [{ scaleY: -1 }],
  },
});

export default Scrim;
