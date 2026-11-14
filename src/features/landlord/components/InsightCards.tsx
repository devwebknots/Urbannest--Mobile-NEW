/**
 * InsightCards: "UrbanNest Intelligence" suggestions in a snapping
 * horizontal row (Rent Trend Analysis, Maintenance Forecast).
 */

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { borderRadius, colors, spacing, typographyPresets } from '@/config/theme';
import { moderateScale as ms } from '@/utils/responsive';
import type { Insight } from '../types';
import { ToneTile } from './DashboardParts';
import { LandlordIcon } from './LandlordIcon';

const TONE_CARD = {
  blue: { bg: colors.surfaceSoft, border: colors.chipBlue, chevron: colors.primary },
  amber: { bg: colors.warningBanner.bg, border: colors.warningBanner.border, chevron: colors.warningDark },
} as const;

export const InsightCards: React.FC<{
  insights: readonly Insight[];
  onPress: (insight: Insight) => void;
}> = ({ insights, onPress }) => {
  const { width } = useWindowDimensions();
  const cardWidth = Math.round(width * 0.8);
  const gap = spacing.md;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + gap}
      decelerationRate="fast"
      contentContainerStyle={[styles.row, { gap }]}
    >
      {insights.map(insight => {
        const tone = TONE_CARD[insight.tone];
        return (
          <Pressable
            key={insight.id}
            onPress={() => onPress(insight)}
            accessibilityRole="button"
            accessibilityLabel={insight.title}
            style={({ pressed }) => [
              styles.card,
              { width: cardWidth, backgroundColor: tone.bg, borderColor: tone.border },
              pressed && styles.pressed,
            ]}
          >
            <ToneTile icon={insight.icon} tone={insight.tone} size={ms(44)} />
            <View style={styles.copy}>
              <Text style={typographyPresets.cardTitle}>{insight.title}</Text>
              <Text style={[typographyPresets.cardSubtitle, styles.body]}>{insight.body}</Text>
            </View>
            <LandlordIcon name="chevronRight" size={ms(16)} color={tone.chevron} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.screenHorizontal,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  copy: {
    flex: 1,
  },
  body: {
    marginTop: spacing.xs,
  },
});

export default InsightCards;
