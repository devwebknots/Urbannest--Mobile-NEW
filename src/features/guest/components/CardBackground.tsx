/**
 * CardBackground: the guest search card background (frosted light blue,
 * white glow, light-blue wash, soft waves). Shared so other cards (e.g.
 * the renter check-in tiles) use the exact same look.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { borderRadius, colors } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';

/** Frosted light-blue card colors, built on the secondary blue #518EF9 */
export const CARD_BG = {
  base: '#EEF4FF',
  edge: 'rgba(255, 255, 255, 0.95)',
  shadow: colors.headerGradientEnd, // #518EF9
  lavender: colors.chipBlue, // #DCE8FB, light-blue wash on the right
  waveLight: 'rgba(147, 187, 252, 0.30)',
  waveMid: 'rgba(81, 142, 249, 0.16)',
  waveDeep: 'rgba(81, 142, 249, 0.12)',
  waveEdge: 'rgba(255, 255, 255, 0.75)',
};

/**
 * Card background: white glow top-left, light-blue wash on the right and
 * soft blue waves flowing in from the bottom-right corner. Big circles
 * clipped by the card's rounded corners; sits behind the card content.
 */
export const CardBackground: React.FC<{ radius?: number }> = ({ radius = borderRadius.xxl }) => (
  <View pointerEvents="none" style={[styles.bgClip, { borderRadius: radius }]}>
    {/* Light wash */}
    <View
      style={[
        styles.bgBlob,
        { width: ms(300), height: ms(300), borderRadius: ms(150), left: -ms(110), top: -ms(170), backgroundColor: '#FFFFFF', opacity: 0.75 },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        { width: ms(320), height: ms(320), borderRadius: ms(160), right: -ms(170), top: -ms(120), backgroundColor: CARD_BG.lavender, opacity: 0.85 },
      ]}
    />
    {/* Waves: overlapping circles whose tops read as flowing curves */}
    <View
      style={[
        styles.bgBlob,
        { width: ms(520), height: ms(520), borderRadius: ms(260), left: '30%', bottom: -ms(436), backgroundColor: CARD_BG.waveMid },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        {
          width: ms(460),
          height: ms(460),
          borderRadius: ms(230),
          left: '48%',
          bottom: -ms(392),
          backgroundColor: CARD_BG.waveLight,
          borderTopWidth: 1.5,
          borderLeftWidth: 1.5,
          borderColor: CARD_BG.waveEdge,
        },
      ]}
    />
    <View
      style={[
        styles.bgBlob,
        { width: ms(400), height: ms(400), borderRadius: ms(200), left: '64%', bottom: -ms(346), backgroundColor: CARD_BG.waveDeep },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  bgClip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  bgBlob: {
    position: 'absolute',
  },
});

export default CardBackground;
