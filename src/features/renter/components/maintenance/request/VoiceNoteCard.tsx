/**
 * VoiceNoteCard: "Describe by Voice" row on the request form. Pale blue
 * card: navy gradient mic button with a soft glow, a thin divider, title
 * + hint, and a small blue sound wave on the right. Tap to record.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, gradients, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import { RenterIcon } from '../../dashboard/RenterIcon';

interface Props {
  onPress: () => void;
}

/** Bar heights of the decorative sound wave */
const WAVE = [8, 14, 22, 12, 28, 18, 30, 16, 24, 12, 8];

export const VoiceNoteCard: React.FC<Props> = ({ onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Describe by voice. Tap to record a quick message"
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <View style={styles.mic}>
      <RenterIcon name="mic" size={ms(24)} color={colors.white} />
    </View>
    <View style={styles.divider} />
    <View style={styles.copy}>
      <Text style={styles.title}>Describe by Voice</Text>
      <Text style={styles.hint}>Tap to record a quick message</Text>
    </View>
    <View style={styles.wave} pointerEvents="none">
      {WAVE.map((h, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            { height: ms(h), backgroundColor: i % 2 ? colors.headerGradientEnd : colors.primary },
          ]}
        />
      ))}
    </View>
  </Pressable>
);

const MIC = ms(54);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    backgroundImage: `linear-gradient(120deg, ${colors.chipBlue} 0%, #EEF4FE 100%)`,
  },
  pressed: {
    opacity: 0.8,
  },
  mic: {
    width: MIC,
    height: MIC,
    borderRadius: MIC / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `linear-gradient(145deg, ${gradients.button[0]} 0%, ${gradients.button[1]} 100%)`,
    boxShadow: '0px 6px 14px rgba(6,89,178,0.35)',
  },
  divider: {
    width: 1,
    height: ms(34),
    backgroundColor: 'rgba(11,42,91,0.15)',
  },
  copy: {
    flex: 1,
  },
  title: {
    ...typographyPresets.cardTitle,
    color: colors.navy,
  },
  hint: {
    ...typographyPresets.cardSubtitle,
    marginTop: ms(2),
  },
  wave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(3),
  },
  bar: {
    width: ms(3),
    borderRadius: ms(1.5),
  },
});

export default VoiceNoteCard;
