/**
 * BrandLogo: the Urban Nest house mark (blue ribbon house with its
 * ice-to-royal-blue gradient). Full-colour PNG, so it is never tinted.
 * The PNG has no padding: the house touches all four edges.
 * Source: scripts/brand/draw_logo.ps1 (vector redraw, 480 x 464).
 *
 * BrandLockup: logo + wordmark, with the bottom of the house sitting on
 * the text baseline (not centred). The descender space under the letters
 * is measured from the real font layout, so it lines up on both platforms.
 */

import React, { useCallback, useState } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextLayoutEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

const LOGO = require('@/assets/images/brand/urban_nest_logo.png');

/** Width / height of the mark */
const ASPECT = 240 / 232;

export const BrandLogo: React.FC<{ size: number; style?: StyleProp<ImageStyle> }> = ({
  size,
  style,
}) => (
  <Image
    source={LOGO}
    style={[{ width: size * ASPECT, height: size }, style]}
    resizeMode="contain"
    accessibilityIgnoresInvertColors
  />
);

interface LockupProps {
  label: string;
  /** Logo height */
  logoSize: number;
  /** Space between logo and text */
  gap: number;
  textStyle: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const BrandLockup: React.FC<LockupProps> = ({ label, logoSize, gap, textStyle, style }) => {
  const fontSize = StyleSheet.flatten(textStyle)?.fontSize ?? 16;
  // Space between the baseline and the bottom of the text box.
  // Starts from a typical value, then uses the measured one.
  const [descent, setDescent] = useState(Math.round(fontSize * 0.24));

  const onTextLayout = useCallback(
    (e: TextLayoutEvent) => {
      const line = e.nativeEvent.lines[0];
      if (!line) {
        return;
      }
      const measured = Math.max(0, Math.min(line.height - line.ascender, fontSize * 0.5));
      setDescent(prev => (Math.abs(prev - measured) > 0.5 ? measured : prev));
    },
    [fontSize],
  );

  return (
    <View style={[styles.row, style]} accessibilityRole="header" accessibilityLabel={label}>
      <BrandLogo size={logoSize} style={{ marginBottom: descent, marginRight: gap }} />
      <Text style={[textStyle, styles.text]} onTextLayout={onTextLayout} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    // No extra Android font padding, so the box is just ascent + descent
    includeFontPadding: false,
  },
});

export default BrandLogo;
